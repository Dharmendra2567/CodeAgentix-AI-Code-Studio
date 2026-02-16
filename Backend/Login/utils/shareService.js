const { createClient } = require("redis");
const { v4: uuidv4 } = require("uuid");

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        tls: true
    },
    password: process.env.REDIS_PASSWORD
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

async function connect() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
}

async function uploadFile(data) {
    await connect();
    const { code, language, title, expiryTime } = data;

    const validExpiryTimes = [10, 30, 60, 1440, 10080];
    const expiryTimeMinutes = parseInt(expiryTime);

    if (!validExpiryTimes.includes(expiryTimeMinutes)) {
        throw new Error("Invalid expiry time.");
    }

    const fileId = uuidv4();
    const expiryDate = new Date(Date.now() + expiryTimeMinutes * 60 * 1000);
    const formattedExpiryTime = expiryDate.toISOString().replace("T", " ").split(".")[0] + " UTC";

    const fileData = {
        title,
        code,
        language,
        expiry_time: formattedExpiryTime
    };

    const key = `file:${language}-${fileId}:data`;
    await redisClient.set(key, JSON.stringify(fileData), {
        EX: expiryTimeMinutes * 60
    });

    const tempFileUrl = process.env.TEMP_FILE_URL || "http://localhost:5000";
    const fileUrl = `${tempFileUrl}/file/${language}-${fileId}`;

    return {
        message: "Code uploaded successfully",
        fileUrl,
        expiry_time: formattedExpiryTime
    };
}

async function getFile(shareId, headerShareId) {
    await connect();

    if (!headerShareId || headerShareId !== shareId) {
        return { redirect: true };
    }

    const [language, fileId] = shareId.split("-");
    if (!language || !fileId) {
        throw new Error("Invalid shareId format.");
    }

    const key = `file:${language}-${fileId}:data`;
    const data = await redisClient.get(key);
    const ttl = await redisClient.ttl(key);

    if (ttl === -2) {
        throw new Error("File not found");
    } else if (ttl <= 0) {
        throw new Error("File has expired");
    }

    if (data) {
        return JSON.parse(data);
    }
    throw new Error("File not found");
}

async function deleteFile(shareId) {
    await connect();
    const [language, fileId] = shareId.split("-");
    const key = `file:${language}-${fileId}:data`;
    const result = await redisClient.del(key);
    if (result === 1) {
        return { message: "File deleted successfully" };
    }
    throw new Error("File not found");
}

module.exports = {
    uploadFile,
    getFile,
    deleteFile
};
