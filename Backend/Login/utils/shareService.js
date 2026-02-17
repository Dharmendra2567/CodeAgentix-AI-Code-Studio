const { v4: uuidv4 } = require("uuid");
const SharedCode = require("../models/SharedCode");

async function uploadFile(data) {
    const { code, language, title, expiryTime } = data;

    const validExpiryTimes = [10, 30, 60, 1440, 10080];
    const expiryTimeMinutes = parseInt(expiryTime);

    if (!validExpiryTimes.includes(expiryTimeMinutes)) {
        throw new Error("Invalid expiry time.");
    }

    const fileId = uuidv4();
    const shareId = `${language}-${fileId}`;
    const expiresAt = new Date(Date.now() + expiryTimeMinutes * 60 * 1000);
    const formattedExpiryTime = expiresAt.toISOString().replace("T", " ").split(".")[0] + " UTC";

    const newSharedCode = new SharedCode({
        shareId,
        code,
        language,
        title,
        expiresAt
    });

    await newSharedCode.save();

    const tempFileUrl = process.env.TEMP_FILE_URL || "http://localhost:5000";
    const fileUrl = `${tempFileUrl}/file/${shareId}`;

    return {
        message: "Code uploaded successfully",
        fileUrl,
        expiry_time: formattedExpiryTime
    };
}

async function getFile(shareId, headerShareId) {
    if (!headerShareId || headerShareId !== shareId) {
        return { redirect: true };
    }

    const sharedCode = await SharedCode.findOne({ shareId });

    if (!sharedCode) {
        throw new Error("File not found or has expired");
    }

    return {
        title: sharedCode.title,
        code: sharedCode.code,
        language: sharedCode.language,
        expiry_time: sharedCode.expiresAt
    };
}

async function deleteFile(shareId) {
    const result = await SharedCode.deleteOne({ shareId });
    if (result.deletedCount === 1) {
        return { message: "File deleted successfully" };
    }
    throw new Error("File not found");
}

module.exports = {
    uploadFile,
    getFile,
    deleteFile
};
