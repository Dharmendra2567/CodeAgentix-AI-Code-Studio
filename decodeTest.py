import base64
msg = "VGhlIG5leHQgc2VkcQ9pbmQgaXMgYSAncHJvdG9jb2wtYmJkaWVkJTI3cnkuIENob29zZSB3aXNlbHku"
print("Decoded message:")
print(base64.b64decode(msg).decode())