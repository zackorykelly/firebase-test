import { useEffect, useRef, useState } from "react"
import { v4 } from "uuid"

import FirebaseStorageService from "../FirebaseStorageService"

function ImageUploadPreview({basePath, existingImageUrl, handleUploadFinish, handleUploadCancel}) {
    const [uploadProgress, setUploadProgress] = useState(-1);
    const [imageUrl, setImageUrl] = useState("");
    const fileInputRef = useRef();

    useEffect(() => {
        if (existingImageUrl) {
            setImageUrl(existingImageUrl)
        } else {
            setUploadProgress(-1)
            setImageUrl("");
            fileInputRef.current.value = null
        }
    }, [existingImageUrl])

    async function handleFileChanged(event) {
        const files = event.target.files;
        const file = files[0];

        if (!file) {
            alert("File select failed");
            return
        }

        const generatedFileId = v4();

        try {
            const downloadUrl = await FirebaseStorageService.uploadFile(
                file,
                `${basePath}/${generatedFileId}`,
                setUploadProgress
            )

            setImageUrl(downloadUrl)
            handleUploadFinish(downloadUrl)
        } catch (error) {
            setUploadProgress(-1)
            fileInputRef.current.value = null
            alert(error.message);
            return
        }
    }

    function handleCancelImageUpload() {
        FirebaseStorageService.deleteFile(imageUrl)
        fileInputRef.current.value = null
        setImageUrl("")
        setUploadProgress(-1)
        handleUploadCancel()
    }
    
    return (
        <div>
            <input type={"file"} accept="image/*" onChange={handleFileChanged} ref={fileInputRef} hidden={uploadProgress > -1 || imageUrl} />
            {!imageUrl && uploadProgress > -1 ? (
                <div>
                    <label htmlFor="file">Upload Progress: </label>
                    <progress id="file" value={uploadProgress} max="100">
                        {uploadProgress}%
                    </progress>
                    <span>{uploadProgress}%</span>
                </div>
            ) : null}
            {imageUrl ? (
                <div>
                    <img height={100} width={100} src={imageUrl} alt={imageUrl} />
                    <button type="button" onClick={handleCancelImageUpload}>Cancel Image</button>
                </div>
            ) : null}
        </div>
    )
}

export default ImageUploadPreview