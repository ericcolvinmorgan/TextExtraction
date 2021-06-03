import { Spinner } from '@fluentui/react/lib/components/Spinner';
import React, { useCallback, useRef, useState } from 'react'
import { useEffect } from 'react'

const PAGE_SCALE = 2.2;

const DocumentViewer = (props: any) => {
  const canvasRef = useRef(null);
  const documentImage = props.image;
  const documentText = props.text;
  const setIsOpen = props.setisopen;
  const setSelectedItem = props.setselectedtextitem;
  const thresholds = props.thresholds;
  const wordList = useRef([] as any);
  const [loading, setLoading] = useState(true);
  const image = useRef(new Image());

  const pageResX = 300.;
  const pageResY = 300.;
  const textResX = documentText.resolution_x;
  const textResY = documentText.resolution_y;

  const getWords = React.useCallback((entry: any, entries: any[]) => {
    if (entry.hierarchy === "WORD") {
      entries.push(entry);
    }
    else {
      for (let entryIndex = 0; entryIndex < entry.sub_entries.length; entryIndex++) {
        getWords(entry.sub_entries[entryIndex], entries);
      }
    }
  }, []);

  const handleCanvasClick = React.useCallback((e: MouseEvent) => {
    const canvas: HTMLCanvasElement = canvasRef.current as unknown as HTMLCanvasElement
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * PAGE_SCALE * (textResX / pageResX)
    const y = (e.clientY - rect.top) * PAGE_SCALE * (textResY / pageResY)
    for (let word = 0; word < wordList.current.length; word++) {
      if (wordList.current[word].x <= x && (wordList.current[word].x + wordList.current[word].width) >= x && wordList.current[word].y <= y && (wordList.current[word].y + wordList.current[word].height) >= y) {
        setSelectedItem({ page: documentText.page_num, word: wordList.current[word], x, y });
        setIsOpen(true);
        return;
      }
    }
  }, [documentText, setIsOpen, setSelectedItem, textResX, textResY]);

  const drawPages = useCallback((thresholds) => {
    const canvas: HTMLCanvasElement = canvasRef.current as unknown as HTMLCanvasElement
    const context = canvas.getContext('2d');
    const canvasWidth = image.current.width;
    const canvasHeight = image.current.height;
    if (context !== null) {
      context.canvas.width = canvasWidth;
      context.canvas.height = canvasHeight;
      context.clearRect(0, 0, canvasWidth, canvasHeight)
      canvas.style.width = `${canvasWidth / PAGE_SCALE}px`;
      canvas.style.height = `${canvasHeight / PAGE_SCALE}px`;
      context.drawImage(image.current, 0, 0, context.canvas.width, context.canvas.height);
      context.font = '20px verdana';

      for (let entryIndex = 0; entryIndex < wordList.current.length; entryIndex++) {
        const x = wordList.current[entryIndex].x * (pageResX / textResX);
        const y = wordList.current[entryIndex].y * (pageResY / textResY);
        const width = wordList.current[entryIndex].width * (pageResX / textResX);
        const height = wordList.current[entryIndex].height * (pageResY / textResY);

        if (wordList.current[entryIndex].confidence === -1 || wordList.current[entryIndex].confidence > thresholds.maxMedium) { //High Confidence
          context.fillStyle = 'rgba(0,255,0,0.7)';
        }
        else if (wordList.current[entryIndex].confidence > thresholds.maxLow && wordList.current[entryIndex].confidence <= thresholds.maxMedium) {  //Medium Confidence
          context.fillStyle = 'rgba(255,255,0,0.7)';
        }
        else {  //Low Confidence
          context.fillStyle = 'rgba(255,0,0,0.7)';
        }

        context.fillRect(x, y, width, height);
        context.fillText(wordList.current[entryIndex].entry, x, y);
      }

      // context.canvas.width = canvasWidth / 2;
      // context.canvas.height = canvasHeight / 2;
      setLoading(false);
    }
  }, [textResX, textResY]);

  useEffect(() => {
    drawPages(thresholds);
  }, [thresholds, drawPages])

  useEffect(() => {
    setLoading(true);
    const canvas: HTMLCanvasElement = canvasRef.current as unknown as HTMLCanvasElement
    const context = canvas.getContext('2d')
    if (context !== null) {
      //Setup canvas events
      canvas.onclick = handleCanvasClick;

      wordList.current = [];
      getWords(documentText.page_text, wordList.current);

      image.current.src = documentImage;
      image.current.onload = () => { drawPages(thresholds) };
    }
  // eslint-disable-next-line  
  }, [documentImage, documentText, textResX, textResY, handleCanvasClick, getWords, drawPages])


  return (<div>
    <Spinner label={`Loading page ${documentText.page_num}.  Please wait...`} style={{ display: loading ? "visible" : "none" }} />
    <canvas ref={canvasRef} style={{ visibility: loading ? "hidden" : "visible" }}>
      Your browser does not support required features.  Please upgrade to a more modern browser to review documents.
    </canvas>
  </div>)
}

export default DocumentViewer