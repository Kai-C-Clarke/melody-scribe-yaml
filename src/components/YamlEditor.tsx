import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as yaml from 'js-yaml';

interface YamlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onValidYaml: (data: any) => void;
}

const YamlEditor = ({ value, onChange, onValidYaml }: YamlEditorProps) => {
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const validateYaml = (yamlText: string) => {
    try {
      const parsed = yaml.load(yamlText);
      setIsValid(true);
      setError('');
      onValidYaml(parsed);
      return true;
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid YAML');
      return false;
    }
  };

  useEffect(() => {
    if (value.trim()) {
      validateYaml(value);
    }
  }, [value]);

  const handleValidate = () => {
    const valid = validateYaml(value);
    toast({
      title: valid ? "✅ YAML Valid" : "❌ YAML Invalid",
      description: valid ? "Your YAML syntax is correct!" : error,
      variant: valid ? "default" : "destructive",
    });
  };

  const insertExample = () => {
    const exampleYaml = `# MIDI Configuration
tempo: 120
time_signature: [4, 4]
tracks:
  - name: "Piano"
    channel: 0
    program: 0
    notes:
      - note: 60  # C4
        velocity: 80
        start: 0.0
        duration: 1.0
      - note: 64  # E4
        velocity: 80
        start: 0.0
        duration: 1.0
      - note: 67  # G4
        velocity: 80
        start: 0.0
        duration: 1.0
  - name: "Bass"
    channel: 1
    program: 32
    notes:
      - note: 36  # C2
        velocity: 100
        start: 0.0
        duration: 2.0`;
    
    onChange(exampleYaml);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">YAML Editor</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={insertExample} size="sm">
            Load Example
          </Button>
          <Button onClick={handleValidate} size="sm" variant={isValid ? "default" : "destructive"}>
            Validate YAML
          </Button>
        </div>
      </div>
      
      <Card className="relative">
        <div className="absolute top-2 right-2 z-10">
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            isValid 
              ? 'bg-waveform/20 text-waveform border border-waveform/30' 
              : 'bg-destructive/20 text-destructive border border-destructive/30'
          }`}>
            {isValid ? 'Valid' : 'Invalid'}
          </div>
        </div>
        
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[400px] p-4 bg-transparent text-foreground font-mono text-sm resize-none border-none outline-none"
            placeholder="Paste or type your YAML here..."
            spellCheck={false}
          />
          
          {/* Syntax highlighting overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <SyntaxHighlighter
              language="yaml"
              style={vscDarkPlus}
              customStyle={{
                background: 'transparent',
                padding: '1rem',
                margin: 0,
                fontSize: '14px',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              }}
              showLineNumbers={false}
            >
              {value || ' '}
            </SyntaxHighlighter>
          </div>
        </div>
        
        {error && (
          <div className="p-4 border-t border-border bg-destructive/10">
            <p className="text-sm text-destructive font-medium">Error:</p>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default YamlEditor;