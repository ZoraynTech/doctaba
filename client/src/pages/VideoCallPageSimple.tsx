import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Phone, FileText, Users } from 'lucide-react';

interface VideoCallPageProps {
  appointmentId: string;
  onEndCall: () => void;
}

// Declare Jitsi types
declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function VideoCallPage({ appointmentId, onEndCall }: VideoCallPageProps) {
  const [callDuration, setCallDuration] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const [, setLocation] = useLocation();

  // Call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simple Jitsi initialization
  useEffect(() => {
    let mounted = true;

    const initJitsi = async () => {
      try {
        // Load Jitsi script if not loaded
        if (!window.JitsiMeetExternalAPI) {
          const script = document.createElement('script');
          script.src = 'https://meet.jit.si/external_api.js';
          script.async = true;
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        if (!mounted || !jitsiContainerRef.current) return;

        // Simple Jitsi configuration to avoid duplicates
        const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
          roomName: `doctaba-${appointmentId}`,
          parentNode: jitsiContainerRef.current,
          width: '100%',
          height: '100%',
          configOverwrite: {
            prejoinPageEnabled: false,
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            // Minimal config to prevent duplicates
            disableFilmstripAutohiding: true,
            filmstrip: { disabled: true },
            disableTileView: true,
            disableSelfView: false,
          },
          interfaceConfigOverwrite: {
            FILMSTRIP_ENABLED: false,
            DISABLE_TILE_VIEW: true,
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'hangup', 'desktop', 'fullscreen'
            ],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_POWERED_BY: false,
          }
        });

        api.addEventListener('readyToClose', () => {
          handleEndCall();
        });

        jitsiApiRef.current = api;
        setJitsiLoaded(true);

      } catch (error) {
        console.error('Failed to initialize Jitsi:', error);
      }
    };

    initJitsi();

    return () => {
      mounted = false;
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch (e) {
          // Ignore dispose errors
        }
        jitsiApiRef.current = null;
      }
    };
  }, [appointmentId]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.dispose();
      } catch (e) {
        // Ignore dispose errors
      }
      jitsiApiRef.current = null;
    }
    onEndCall();
    setLocation('/appointments');
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">In Call</span>
          </div>
          <span className="text-sm text-gray-300">{formatDuration(callDuration)}</span>
        </div>
        
        <div className="text-center">
          <h1 className="text-lg font-semibold">Video Consultation</h1>
          <p className="text-sm text-gray-300">Appointment #{appointmentId}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-2 rounded-lg transition-colors ${
              showNotes ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <FileText className="h-5 w-5" />
          </button>
          <button
            onClick={handleEndCall}
            className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <Phone className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Container */}
        <div className="flex-1 relative">
          <div 
            ref={jitsiContainerRef}
            className="w-full h-full bg-gray-800"
          >
            {!jitsiLoaded && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-16 w-16 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium">Loading Video Call...</p>
                  <p className="text-sm text-gray-400">Connecting to secure video conference</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes Panel */}
        {showNotes && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Call Notes</h3>
              <p className="text-sm text-gray-600">Take notes during your consultation</p>
            </div>
            
            <div className="flex-1 p-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-full resize-none border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Type your notes here..."
              />
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <button className="w-full bg-cyan-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors">
                Save Notes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}