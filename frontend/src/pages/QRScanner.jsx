import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../api/api";
import { endpoints } from "../api/endpoints";

export default function QRScanner() {
    const [scanned, setScanned] = useState('');
    const [cameras, setCameras] = useState([]);
    const [selectedCameraId, setSelectedCameraId] = useState(null);
    const scannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);
    const hasScannedRef = useRef(false);


    const startScanner = (cameraId) => {
    
        if (!scannerRef.current) {
            console.warn("Scanner DOM element not found.");
            return;
        }

        html5QrCodeRef.current.start(
            cameraId,
            { fps: 10, qrbox: 250 },
            async (decodedText) => {
                if (!hasScannedRef.current) {
                    hasScannedRef.current = true;
                    setScanned(decodedText);
                    await api.post(endpoints.attendance.scan, { data: decodedText });
                    alert("Scanned and submitted!");
                }
            },
            (errorMessage) => {
                console.warn("QR Code scan error:", errorMessage);
            }
        ).catch(err => {
            console.error("Failed to start scanner:", err);
        });
    };

    useEffect(() => {
        const qrRegionId = "qr-reader";
        html5QrCodeRef.current = new Html5Qrcode(qrRegionId);

        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                setCameras(devices);
                const defaultCamera = devices[0];
                setSelectedCameraId(defaultCamera.id);
                startScanner(defaultCamera.id);
            }
        }).catch(err => {
            console.error("Camera access error:", err);
        });

    
        return () => {
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop().then(() => {
                    html5QrCodeRef.current.clear();
                }).catch(err => {
                    console.error("Failed to stop scanning", err);
                });
            }
        };
    }, []);


    const handleCameraChange = (event) => {
        const cameraId = event.target.value;
        setSelectedCameraId(cameraId);
        if (html5QrCodeRef.current) {
            html5QrCodeRef.current.stop().then(() => {
                startScanner(cameraId);
            }).catch(err => {
                console.error("Error stopping scanner:", err);
            });
        }
    };

    return (
        <div>
            <h2>QR Scanner</h2>

            <div id="qr-reader" ref={scannerRef} style={{ width: "300px" }}></div>

            <div>
                <h3>Select Camera:</h3>
                <select onChange={handleCameraChange} value={selectedCameraId}>
                    {cameras.map((cam) => (
                        <option key={cam.id} value={cam.id}>
                            {cam.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
