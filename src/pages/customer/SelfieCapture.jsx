import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, PageTitle, Progress } from '../../components/UI';

export default function SelfieCapture() {
  const [stream, setStream] = useState(null);
  const [active, setActive] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null);
  const [countdown, setCountdown] = useState(100);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const prompts = [
    "Please blink slowly",
    "Slightly turn your head left",
    "Face forward and smile"
  ];

  const enableCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      setActive(true);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      alert("Camera permission denied. Please upload a selfie manually.");
    }
  };

  useEffect(() => {
    if (active && promptIndex < prompts.length) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 0) {
            setPromptIndex(idx => idx + 1);
            return 100;
          }
          return prev - 2;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [active, promptIndex]);

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    setCapturedImage(canvas.toDataURL('image/jpeg'));
    if (stream) stream.getTracks().forEach(track => track.stop());
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
      <PageTitle title="Selfie Verification" subtitle="Complete the liveness check to verify your identity" />

      <Card style={{ padding: '20px', overflow: 'hidden', position: 'relative' }}>
        {!active && !capturedImage && (
          <div style={{ padding: '100px 0' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>📸</div>
            <Button onClick={enableCamera}>Enable Camera</Button>
            <p className="muted" style={{ marginTop: '20px' }}>We need camera access for identity verification</p>
          </div>
        )}

        {active && !capturedImage && (
          <div style={{ position: 'relative' }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '16px', background: '#000' }} />
            
            {/* Face guide overlay */}
            <div style={{ 
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '240px', height: '320px', border: '3px dashed rgba(255,255,255,0.5)', borderRadius: '50%'
            }}></div>

            <div style={{ position: 'absolute', bottom: '20px', left: '0', right: '0', padding: '0 40px' }}>
              {promptIndex < prompts.length ? (
                <div style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: '15px', borderRadius: '12px' }}>
                  <div style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>{prompts[promptIndex]}</div>
                  <Progress value={countdown} color="var(--primary)" />
                </div>
              ) : (
                <Button onClick={capturePhoto} style={{ padding: '15px 40px', fontSize: '18px', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
                  Capture Photo
                </Button>
              )}
            </div>
          </div>
        )}

        {capturedImage && (
          <div>
            <img src={capturedImage} style={{ width: '100%', borderRadius: '16px' }} />
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
              <Button variant="secondary" onClick={() => { setCapturedImage(null); enableCamera(); setPromptIndex(0); }}>Retake</Button>
              <Button onClick={() => navigate('/app/processing')}>Continue</Button>
            </div>
          </div>
        )}
      </Card>

      <div style={{ marginTop: '20px' }}>
        <a href="#" className="muted" onClick={(e) => { e.preventDefault(); navigate('/app/processing'); }}>Upload selfie instead</a>
      </div>
    </div>
  );
}
