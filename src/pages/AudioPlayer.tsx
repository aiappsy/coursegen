import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useRemark } from "react-remarkify";
import { useSpeech, useVoices } from "react-text-to-speech";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AudioPlayer = () => {

    const languages = [
        { "code": "en", "name": "English" },
        { "code": "ar", "name": "Arabic" },
        { "code": "bn", "name": "Bengali" },
        { "code": "bg", "name": "Bulgarian" },
        { "code": "zh", "name": "Chinese" },
        { "code": "hr", "name": "Croatian" },
        { "code": "cs", "name": "Czech" },
        { "code": "da", "name": "Danish" },
        { "code": "nl", "name": "Dutch" },
        { "code": "et", "name": "Estonian" },
        { "code": "fi", "name": "Finnish" },
        { "code": "fr", "name": "French" },
        { "code": "de", "name": "German" },
        { "code": "el", "name": "Greek" },
        { "code": "he", "name": "Hebrew" },
        { "code": "hi", "name": "Hindi" },
        { "code": "hu", "name": "Hungarian" },
        { "code": "id", "name": "Indonesian" },
        { "code": "it", "name": "Italian" },
        { "code": "ja", "name": "Japanese" },
        { "code": "ko", "name": "Korean" },
        { "code": "lv", "name": "Latvian" },
        { "code": "lt", "name": "Lithuanian" },
        { "code": "no", "name": "Norwegian" },
        { "code": "pl", "name": "Polish" },
        { "code": "pt", "name": "Portuguese" },
        { "code": "ro", "name": "Romanian" },
        { "code": "ru", "name": "Russian" },
        { "code": "sr", "name": "Serbian" },
        { "code": "sk", "name": "Slovak" },
        { "code": "sl", "name": "Slovenian" },
        { "code": "es", "name": "Spanish" },
        { "code": "sw", "name": "Swahili" },
        { "code": "sv", "name": "Swedish" },
        { "code": "th", "name": "Thai" },
        { "code": "tr", "name": "Turkish" },
        { "code": "uk", "name": "Ukrainian" },
        { "code": "vi", "name": "Vietnamese" }
    ];

    const { state } = useLocation();
    const navigate = useNavigate();
    const { sub, main, theory, photo, lang } = state || {};
    const { voices } = useVoices();
    const [langCode, setLangCode] = useState('en');
    const [voiceURI, setVoiceURI] = useState("");
    const reactContent = useRemark({
        markdown: theory,
        rehypePlugins: [rehypeRaw, rehypeSanitize],
        remarkPlugins: [remarkGfm],
        remarkToRehypeOptions: { allowDangerousHtml: true },
    });


    // SEEK BAR STATE
    const [currentTime, setCurrentTime] = useState(0);
    const intervalRef = useRef<any>(null);


    const {
        Text, // Component that renders speech text in a <div> and supports standard HTML <div> props
        speechStatus, // String that stores current speech status
        isInQueue, // Indicates whether the speech is currently playing or waiting in the queue
        start, // Function to start the speech or put it in queue
        pause, // Function to pause the speech
        stop, // Function to stop the speech or remove it from queue
    } = useSpeech({
        text: reactContent,
        lang: langCode,
        voiceURI: voiceURI,
        highlightText: true,
        showOnlyHighlightedText: false,
        highlightMode: "word",
        highlightProps: { style: { color: "black", backgroundColor: "yellow", textDecoration: "underline" } },
        onBoundary: (event) => {
            setCurrentTime(event.progress);
            console.log("Speech Progress:", event.progress);
        },
    });

    // TIMER for seek bar animation
    // const startTimer = () => {
    //     clearInterval(intervalRef.current);
    //     intervalRef.current = setInterval(() => {
    //         setCurrentTime((prev) => {
    //             if (prev >= duration) {
    //                 clearInterval(intervalRef.current);
    //                 return duration;
    //             }
    //             return prev + 0.4; // update every 0.4s
    //         });
    //     }, 400);
    // };


    // Pause timer when speaking ends
    useEffect(() => {
        if (speechStatus === "stopped") {
            clearInterval(intervalRef.current);
        }
    }, [speechStatus]);


    useEffect(() => {
        console.log(lang);
        window.scrollTo(0, 0);
        setLangCode(getLanguageCode(lang));
        console.log(getLanguageCode(lang))
        // Set a timeout to run after 5 seconds
        const timeoutId = setTimeout(() => {
            if (voices.length > 0) { // Ensure voices is populated
                voices
                    .filter((voice) => !langCode || voice.lang?.toLowerCase().includes(langCode.toLowerCase()))
                    .map((voiceURI, index) => {
                        console.log(index);
                        if (index === 0) {
                            setVoiceURI(voiceURI.name);
                        }
                    });
            }
        }, 5000); // 5000 milliseconds = 5 seconds

        // Cleanup timeout on component unmount
        return () => clearTimeout(timeoutId);
    }, [langCode, voices]); // Add langCode and voices as dependencies

    const getLanguageCode = (languageName: string) => {
        const language = languages.find(lang => lang.name.toLowerCase() === languageName.toLowerCase());
        return language ? language.code : null; // Returns null if language not found
    };

    // Pause timer when speaking ends
    useEffect(() => {
        if (speechStatus === "stopped") {
            clearInterval(intervalRef.current);
        }
    }, [speechStatus]);


    // PLAY / PAUSE button
    const togglePlay = () => {
        if (speechStatus === "started") {
            pause();
            clearInterval(intervalRef.current);
        } else {
            start();
        }
    };
    return (
        <div className="min-h-screen pb-32">
            <div className="container mx-auto pt-8 pb-20">
                <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Courses
                </Button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                        {main}
                    </h1>
                </div>

                <div className="space-y-4">
                    <style>
                        {`
/* Headings */
.styled-text h1 {
  font-size: 2rem;
  margin-top: 1.5em;
  margin-bottom: 0.6em;
  color: #222;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 0.3em;
}

.styled-text h2 {
  font-size: 1.6rem;
  margin-top: 1.3em;
  margin-bottom: 0.5em;
  color: #333;
}

.styled-text h3 {
  font-size: 1.3rem;
  margin-top: 1.1em;
  margin-bottom: 0.4em;
  color: #444;
}

/* Paragraphs */
.styled-text p {
  margin: 0.5em 0 1em;
}

/* Lists */
.styled-text ul,
.styled-text ol {
  margin: 0.8em 0 1em 2em;
}

.styled-text li {
  margin-bottom: 0.4em;
}

/* Links */
.styled-text a {
  color: #007bff;
  text-decoration: none;
  border-bottom: 1px dotted #007bff;
}

.styled-text a:hover {
  text-decoration: underline;
}

/* Inline code */
.styled-text code {
  background-color: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  color: #d63384;
  font-size: 0.95em;
}

/* Code blocks */
.styled-text pre {
  background-color: #1e1e1e;
  color: #e4e4e4;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  margin: 1.5em 0;
  font-size: 0.9rem;
}

/* Highlighting keywords (optional basic syntax) */
.styled-text pre code .keyword {
  color: #569cd6;
}
.styled-text pre code .string {
  color: #ce9178;
}
.styled-text pre code .function {
  color: #dcdcaa;
}

/* Blockquotes */
.styled-text blockquote {
  border-left: 4px solid #ccc;
  margin: 1em 0;
  padding-left: 1em;
  color: #666;
  font-style: italic;
}

/* Horizontal rules */
.styled-text hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 2em 0;
}

        `}
                    </style>
                    <Text className="styled-text">{theory}</Text>
                    {/* <StyledText text={theory} /> */}
                </div>
            </div>

            {/* Sticky Audio Player */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg">
                <div className="container mx-auto p-4">

                    <div className="flex items-center gap-4 mb-4">
                        <img
                            src={photo}
                            alt={main}
                            className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{main}</p>
                            <p className="text-sm text-muted-foreground">{sub}</p>
                        </div>
                    </div>

                    <Slider
                        value={[currentTime]}
                        max={100}
                        step={1}
                        className="mb-4"
                        disabled={true}
                    />

                    <div className="flex items-center justify-between mb-2">
                        {/* <span className="text-sm text-muted-foreground">{formatTime(currentTime)}</span> */}
                        {/* <span className="text-sm text-muted-foreground">{formatTime(duration)}</span> */}
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <Button
                            size="icon"
                            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
                            onClick={togglePlay}
                        >
                            {speechStatus === "started" ? (
                                <Pause className="h-6 w-6" />
                            ) : (
                                <Play className="h-6 w-6" />
                            )}
                        </Button>

                        <div className="flex items-center gap-2 ml-auto">
                            {voices && <Select value={voiceURI} onValueChange={setVoiceURI}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose a voice" />
                                </SelectTrigger>

                                <SelectContent position="popper" side="top" align="start">
                                    {voices
                                        .filter((voice) => !langCode || voice.lang?.toLowerCase().includes(langCode.toLowerCase()))
                                        .map(({ voiceURI }) => (
                                            <SelectItem key={voiceURI} value={voiceURI}>
                                                {voiceURI}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;