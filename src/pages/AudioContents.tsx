import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { serverURL } from '@/constants';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from 'flowbite-react';
import Ads from '@/components/Ads';

const AudioContents = () => {
  const { courseId } = useParams();
  const { state } = useLocation();
  const { mainTopic, type, end, pass, lang, photo } = state || {};
  const jsonData = JSON.parse(sessionStorage.getItem('jsonData'));
  const [isLoading, setIsLoading] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  function redirectAudio(topics: any, title: any, theory: any) {
    navigate('/audio-player/' + courseId, {
      state: {
        sub: topics,
        main: title,
        theory,
        photo,
        lang
      }
    });
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelect = (topics, sub) => {
    if (!isLoading) {
      const mTopic = jsonData[mainTopic.toLowerCase()].find(topic => topic.title === topics);
      const mSubTopic = mTopic?.subtopics.find(subtopic => subtopic.title === sub);

      if (mSubTopic.theory === '' || mSubTopic.theory === undefined || mSubTopic.theory === null) {
        if (type === 'video & text course') {

          const query = `${mSubTopic.title} ${mainTopic} in english`;
          setIsLoading(sub);
          sendVideo(query, topics, sub, mSubTopic.title);

        } else {

          const prompt = `Strictly in ${lang}, Explain me about this subtopic of ${mainTopic} with examples :- ${mSubTopic.title}. Please Strictly Don't Give Additional Resources And Images.`;
          const promptImage = `Example of ${mSubTopic.title} in ${mainTopic}`;
          setIsLoading(sub);
          sendPrompt(prompt, promptImage, topics, sub);

        }
      } else {
        redirectAudio(topics, mSubTopic.title, mSubTopic.theory);
      }
    }
  };

  async function sendPrompt(prompt, promptImage, topics, sub) {
    const dataToSend = {
      prompt: prompt,
    };
    try {
      const postURL = serverURL + '/api/generate';
      const res = await axios.post(postURL, dataToSend);
      const generatedText = res.data.text;
      const htmlContent = generatedText;
      try {
        const parsedJson = htmlContent;
        sendImage(parsedJson, promptImage, topics, sub);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Internal Server Error",
        });
        setIsLoading('');
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Internal Server Error",
      });
      setIsLoading('');
    }
  }

  async function sendImage(parsedJson, promptImage, topics, sub) {
    const dataToSend = {
      prompt: promptImage,
    };
    try {
      const postURL = serverURL + '/api/image';
      const res = await axios.post(postURL, dataToSend);
      try {
        const generatedText = res.data.url;
        sendData(generatedText, parsedJson, topics, sub);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Internal Server Error",
        });
        setIsLoading('');
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Internal Server Error",
      });
      setIsLoading('');
    }
  }

  async function sendData(image, theory, topics, sub) {

    const mTopic = jsonData[mainTopic.toLowerCase()].find(topic => topic.title === topics);
    const mSubTopic = mTopic?.subtopics.find(subtopic => subtopic.title === sub);
    mSubTopic.theory = theory
    mSubTopic.image = image;
    mSubTopic.done = true;
    updateCourse(topics, sub, mSubTopic.theory);
  }

  async function sendDataVideo(image, theory, topics, sub) {

    const mTopic = jsonData[mainTopic.toLowerCase()].find(topic => topic.title === topics);
    const mSubTopic = mTopic?.subtopics.find(subtopic => subtopic.title === sub);
    mSubTopic.theory = theory
    mSubTopic.youtube = image;
    mSubTopic.done = true;
    updateCourse(topics, sub, mSubTopic.theory);

  }

  async function updateCourse(topics: any, sub: any, theory: any) {
    sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
    const dataToSend = {
      content: JSON.stringify(jsonData),
      courseId: courseId
    };
    try {
      const postURL = serverURL + '/api/update';
      await axios.post(postURL, dataToSend);
      setIsLoading('');
      redirectAudio(topics, sub, theory);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Internal Server Error",
      });
      setIsLoading('');
    }
  }

  async function sendVideo(query, mTopic, mSubTopic, subtop) {
    const dataToSend = {
      prompt: query,
    };
    try {
      const postURL = serverURL + '/api/yt';
      const res = await axios.post(postURL, dataToSend);

      try {
        const generatedText = res.data.url;
        sendTranscript(generatedText, mTopic, mSubTopic, subtop);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Internal Server Error",
        });
        setIsLoading('');
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Internal Server Error",
      });
      setIsLoading('');
    }
  }

  async function sendTranscript(url, mTopic, mSubTopic, subtop) {
    const dataToSend = {
      prompt: url,
    };
    try {
      const postURL = serverURL + '/api/transcript';
      const res = await axios.post(postURL, dataToSend);

      try {
        const generatedText = res.data.url;
        const allText = generatedText.map(item => item.text);
        const concatenatedText = allText.join(' ');
        const prompt = `Strictly in ${lang}, Summarize this theory in a teaching way :- ${concatenatedText}.  Do not include phrases such as "Okay", "Sure", or "I'll explain". Start directly with the explanation. Write in a professional, documentation style.`;
        sendSummery(prompt, url, mTopic, mSubTopic);
      } catch (error) {
        console.error(error)
        const prompt = `Strictly in ${lang}, Explain me about this subtopic of ${mainTopic} with examples :- ${subtop}. Please Strictly Don't Give Additional Resources And Images.  Do not include phrases such as "Okay", "Sure", or "I'll explain". Start directly with the explanation. Write in a professional, documentation style.`;
        sendSummery(prompt, url, mTopic, mSubTopic);
      }

    } catch (error) {
      console.error(error)
      const prompt = `Strictly in ${lang}, Explain me about this subtopic of ${mainTopic} with examples :- ${subtop}.  Please Strictly Don't Give Additional Resources And Images.  Do not include phrases such as "Okay", "Sure", or "I'll explain". Start directly with the explanation. Write in a professional, documentation style.`;
      sendSummery(prompt, url, mTopic, mSubTopic);
    }
  }

  async function sendSummery(prompt, url, mTopic, mSubTopic) {
    const dataToSend = {
      prompt: prompt,
    };
    try {
      const postURL = serverURL + '/api/generate';
      const res = await axios.post(postURL, dataToSend);
      const generatedText = res.data.text;
      const htmlContent = generatedText;
      try {
        const parsedJson = htmlContent;
        sendDataVideo(url, parsedJson, mTopic, mSubTopic);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Internal Server Error",
        });
        setIsLoading('');
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Internal Server Error",
      });
      setIsLoading('');
    }
  }

  const renderTopicsAndSubtopics = (topics) => {
    return (
      <>
        {topics.map((topic) => (
          <div key={topic.title} className="mb-6">
            {/* Topic Card */}
            <Card className="p-5 bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors cursor-pointer rounded-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-primary">
                  {topic.title}
                </h2>
              </div>
            </Card>

            {/* Subtopics */}
            <div className="mt-3 space-y-2 pl-4 border-l-2 border-muted">
              {topic.subtopics.map((subtopic) => (
                <Card
                  key={subtopic.title}
                  className="p-4 hover:bg-muted/50 transition-colors cursor-pointer rounded-md"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{subtopic.title}</h4>
                    {isLoading === subtopic.title ?
                      <Spinner size="xl" className='fill-primary text-transparent dark:text-transparent dark:fill-primary' />
                      :
                      <Button
                        onClick={() => handleSelect(topic.title, subtopic.title)}
                        size="icon"
                        className="rounded-full bg-primary hover:bg-primary/90"
                      >
                        <Play className="h-5 w-5" />
                      </Button>}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  };


  return (
    <div>
      <div className="container mx-auto py-8">
        <Link to="/dashboard/audio-courses">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>

        <div className="mb-8">
          <img
            src={photo}
            alt={mainTopic}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            {mainTopic}
          </h1>
        </div>

        <div className="space-y-4">
          {jsonData && renderTopicsAndSubtopics(jsonData[mainTopic.toLowerCase()])}
        </div>
      </div>
      <Ads />
    </div>
  );
};

export default AudioContents;