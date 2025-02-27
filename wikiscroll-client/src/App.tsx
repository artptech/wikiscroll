import { useQuery, keepPreviousData } from '@tanstack/react-query'
import './App.css'
import { Separator } from "@/components/ui/separator"
import { useCallback, useEffect, useRef, useState, Ref } from 'react';
import { Moon, Smile, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from './components/providers/ThemeProvider';

interface Article {
  id: number;
  title?: string;
  description?: string;
  body?: string;
  images?: {
    thumbnail?: string;
  };
}

const API_URL = 'http://localhost:8000';

const ScrollTrigger = ({ callback }: { callback: () => void }) => {
  const ref = useRef<HTMLDivElement>(undefined);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const options = {
      root: null,
      rootMargin: '150px',
      threshold: 0
    };

    const intersectionCallback: IntersectionObserverCallback = (entries) => {
      if (entries[0].isIntersecting) {
        callback()
      }
    };

    const observer = new IntersectionObserver(intersectionCallback, options);
    observer.observe(target);

    return () => {
      if (observer) {
        observer.unobserve(target);
      }
    };
  }, [callback]);

  return (
    <div ref={ref as Ref<HTMLDivElement>}></div>
  );
};

function App() {
  const { setTheme, theme } = useTheme();
  const [timestamp, setTimeStamp] = useState(0);
  const { isLoading, data, isFetching } = useQuery<{ body: { Article: Article } }>({
    queryKey: ['latestArticle', timestamp],
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    staleTime: 0,
    queryFn: () =>
      fetch(`${API_URL}/api/random`).then((res) =>
        res.json(),
      ),
  })

  const [queue, setQueue] = useState<Article[]>([]);
  const fetchNextArticle = useCallback(() => {
    setTimeStamp(new Date().getTime());
  }, [])

  useEffect(() => {
    if (data) {
      setQueue((current) => [...current, data.body.Article]);
    }
  }, [data]);

  if (isLoading) {
    return <>
      <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight lg:text-5xl">
        WikiScroll
      </h1>
      <p className="text-xl text-center text-muted-foreground">
        ...
      </p>
    </>
  }

  return (
    <>
    <div className="border-solid border-b-2 flex place-content-between items-center fixed top-0 left-0 right-0 bg-(--background) px-8 py-4">
    <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
        WikiScroll
      </h1>
      <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        { theme === 'dark' ? <Sun /> : <Moon /> }
      </Button>
    </div>
    <div className='mt-20'>
      <p className="text-lg justify-center font-semibold mb-15 flex gap-3">Happy Scrolling <Smile color='hsl(45.4 93.4% 47.5%)' /></p>
      {queue.map((article: Article) => <div key={article.id}>
        {article.title && (  
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {article.title}
          </h2>
        )}
        {article.description && (  
          <p className="text-xl text-muted-foreground">
          {article.description}
        </p>
        )}
        {article.body && (  
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {article.body}
        </p>
        )}
        {article.images?.thumbnail && ( 
        <img
            src={article.images.thumbnail}
            alt={article.title}
            className="h-full w-full rounded-md object-cover mt-6"
          />
        )}
          <Separator className='mt-20 mb-20' /> 
          </div>
      )}
    </div>
    <ScrollTrigger callback={fetchNextArticle} />
    {isFetching && (
      <div className='fixed loader bottom-15 left-1/2 transform -translate-x-1/2'></div>
    )}
    </>
  )
}

export default App
