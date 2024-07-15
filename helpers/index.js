import cloudinary from "cloudinary";

export async function uploadImages(imageFiles = []) {
    const uploadPromises = imageFiles.map(async (image, index) => {
        if (!image.buffer) {
            throw new Error(`Image at index ${index} is missing buffer data`);
        }

        const b64 = image.buffer.toString('base64');
        let dataURI = `data:${image.mimetype};base64,${b64}`;

        try {
            const res = await cloudinary.v2.uploader.upload(dataURI);
            return {
                fileName: image.originalname,
                fileType: image.mimetype,
                file: res.secure_url
            };
        } catch (uploadError) {
            console.error(`Error uploading image at index ${index}:`, uploadError);
            throw uploadError;
        }
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}
