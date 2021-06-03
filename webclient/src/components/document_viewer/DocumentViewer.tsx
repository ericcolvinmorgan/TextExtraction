import { Spinner } from '@fluentui/react/lib/components/Spinner';
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'

const DocumentViewer = (props: any) => {

  const documentImage = props.image;
  const documentText = props.text;
  const setSelectedItem = props.setSelectedItem;
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true)

  const getWords = (entry: any, entries: any[]) => {
    if (entry.hierarchy == "WORD") {
      entries.push(entry);
    }
    else {
      for (let entryIndex = 0; entryIndex < entry.sub_entries.length; entryIndex++) {
        getWords(entry.sub_entries[entryIndex], entries);
      }
    }
  }

  const handleCanvasClick = (e : MouseEvent) => {
    const canvas: HTMLCanvasElement = canvasRef.current as unknown as HTMLCanvasElement
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    console.log("x: " + x + " y: " + y)
  }

  useEffect(() => {

    setLoading(true);
    console.log(documentText);

    const canvas: HTMLCanvasElement = canvasRef.current as unknown as HTMLCanvasElement

    
    const context = canvas.getContext('2d')
    if (context !== null) {
      //Setup canvas events
      canvas.onclick = handleCanvasClick;
      
      const wordList = [] as any[];
      getWords(documentText.page_text, wordList);
      
      const image = new Image();
      image.src = documentImage;
      image.onload = () => {
        const canvasWidth = image.width;
        const canvasHeight = image.height;
        const textResX = documentText.resolution_x;
        const textResY = documentText.resolution_y;

        context.canvas.width = canvasWidth;
        context.canvas.height = canvasHeight;
        canvas.style.width = `${canvasWidth / 2.2}px`;
        canvas.style.height = `${canvasHeight / 2.2}px`;
        context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
        context.font = '20px verdana';

        for (let entryIndex = 0; entryIndex < wordList.length; entryIndex++) {
          const x = wordList[entryIndex].x * (300. / textResX);
          const y = wordList[entryIndex].y * (300. / textResY);
          const width = wordList[entryIndex].width * (300. / textResX);
          const height = wordList[entryIndex].height * (300. / textResY);
          
          if(wordList[entryIndex].confidence === -1 || wordList[entryIndex].confidence > 80) { //High Confidence
            context.fillStyle = 'rgba(0,255,0,0.7)';
          }
          else if (wordList[entryIndex].confidence > 60 && wordList[entryIndex].confidence < 80) {  //Medium Confidence
            context.fillStyle = 'rgba(255,255,0,0.7)';
          }
          else {  //Low Confidence
            context.fillStyle = 'rgba(255,0,0,0.7)';
          }

          context.fillRect(x, y, width, height);
          context.fillText(wordList[entryIndex].entry, x, y);
        }

        // context.canvas.width = canvasWidth / 2;
        // context.canvas.height = canvasHeight / 2;
        setLoading(false);
      }
    }

    // //Our first draw
    // context.fillStyle = '#000000'
    // context.fillRect(0, 0, context.canvas.width, context.canvas.height)
  }, [])


  return (<div>
    <Spinner label={`Loading page ${documentText.page_num}.  Please wait...`} style={{ display: loading ? "visible" : "none" }} />
    <canvas ref={canvasRef} {...props} style={{ visibility: loading ? "hidden" : "visible" }} />
  </div>)
}

export default DocumentViewer