import tweetnaclUtil from 'tweetnacl-util';
import { decrypt } from '../../shared/helpers/crypto';
import config from '../config';

const { decodeBase64 } = tweetnaclUtil;

export const downloadFile = async (fileData, token) => {
    const { file, secretId, encryptionKey } = fileData;

    const { key, ext, type } = file;

    const data = await fetch(`${config.get('api.host')}/download/`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ key, secretId }),
    });

    const json = await data.json();

    if (data.status === 401) {
        return {
            statusCode: 401,
        };
    }

    const fileContent = decodeBase64(decrypt(json.content, encryptionKey));

    const a = document.createElement('a');
    const blob = new Blob([fileContent], { type });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = key + ext;
    a.click();
    window.URL.revokeObjectURL(url);
};
