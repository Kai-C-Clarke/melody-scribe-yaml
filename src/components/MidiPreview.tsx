import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MidiPreviewProps {
  data: any;
}

const MidiPreview = ({ data }: MidiPreviewProps) => {
  const { toast } = useToast();

  if (!data) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">MIDI Preview</h2>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Enter valid YAML to see preview</p>
        </Card>
      </div>
    );
  }

  const handleGenerateMidi = () => {
    toast({
      title: "🎵 MIDI Generation",
      description: "Backend integration needed for MIDI file generation",
    });
  };

  const renderNoteInfo = (note: any, index: number) => (
    <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="font-mono">
          Note {note.note}
        </Badge>
        <span className="text-sm text-muted-foreground">
          Vel: {note.velocity || 'N/A'}
        </span>
      </div>
      <div className="text-right text-sm">
        <div className="text-foreground">Start: {note.start || 0}s</div>
        <div className="text-muted-foreground">Duration: {note.duration || 1}s</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">MIDI Preview</h2>
        <Button onClick={handleGenerateMidi} className="bg-studio-gradient1 hover:bg-studio-gradient1/90">
          Generate MIDI
        </Button>
      </div>

      <div className="space-y-4">
        {/* Tempo & Time Signature */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-studio-purple">Song Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Tempo</Badge>
              <span className="font-mono text-accent">{data.tempo || 120} BPM</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Time Signature</Badge>
              <span className="font-mono text-accent">
                {data.time_signature ? `${data.time_signature[0]}/${data.time_signature[1]}` : '4/4'}
              </span>
            </div>
          </div>
        </Card>

        {/* Tracks */}
        {data.tracks && Array.isArray(data.tracks) && (
          <div className="space-y-4">
            <h3 className="font-semibold text-studio-blue">Tracks ({data.tracks.length})</h3>
            {data.tracks.map((track: any, trackIndex: number) => (
              <Card key={trackIndex} className="p-4 border-l-4 border-l-studio-gradient1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-lg text-foreground">
                      {track.name || `Track ${trackIndex + 1}`}
                    </h4>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">Channel {track.channel || 0}</Badge>
                      <Badge variant="outline">Program {track.program || 0}</Badge>
                    </div>
                  </div>
                  <Badge className="bg-waveform/20 text-waveform border-waveform/30">
                    {track.notes?.length || 0} notes
                  </Badge>
                </div>

                {track.notes && Array.isArray(track.notes) && track.notes.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-muted-foreground mb-2">Notes:</h5>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {track.notes.map(renderNoteInfo)}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Additional sections for other YAML structures */}
        {data.program_changes && (
          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-studio-blue">Program Changes</h3>
            <div className="text-sm text-muted-foreground">
              {JSON.stringify(data.program_changes, null, 2)}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MidiPreview;