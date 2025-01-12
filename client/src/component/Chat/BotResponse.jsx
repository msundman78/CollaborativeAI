import React, { useState, useEffect } from "react";

// libraries
import { marked } from "marked";
import CodeHighlighter from "../common/CodeHighlighter";

// components

const BotResponse = ({ response }) => {
  const [formattedResponseArray, setFormattedResponseArray] = useState();

  // removed chatLog from parameter and dependency, as it is unused

  const replaceCodeBlocks = (text) => {
    const codeBlockRegex = /```(\w+)\s*([\s\S]+?)```/g;
    let match;
    let lastIndex = 0;
    const result = [];
  
    while ((match = codeBlockRegex.exec(text)) !== null) {
      const language = match[1].toLowerCase();
      const code = match[2].trim();
      const precedingText = text.substring(lastIndex, match.index);
  
      // Add preceding text as a text object
      if (precedingText) {
        result.push({ type: 'text', content: precedingText });
      }
  
      // Add code block as a code object
      result.push({ type: 'code', content: code, language });
  
      lastIndex = match.index + match[0].length;
    }
  
    const remainingText = text.substring(lastIndex);
    
    // Add remaining text as a text object
    if (remainingText) {
      result.push({ type: 'text', content: remainingText });
    }
  
    return result;
  };
  

  useEffect(() => {
      if(response) {
        setFormattedResponseArray(replaceCodeBlocks(response));
      }
  }, [response])

  const getMarkedContent = (content) => {
    const tableHtml = { __html: marked(content) };

    return (
      <div id="table-response-container">
        <div dangerouslySetInnerHTML={tableHtml} />
      </div>
    );
  }
  
  return (
    <>
        {formattedResponseArray?.map((item, index) => {
          if(item.type === 'text') {
            return <pre key={index}>{getMarkedContent(item.content)}</pre>
          } else if (item.type === 'code') {
            return <CodeHighlighter key={index} code={item.content} language={item.language} />
          }
        })}
    </>
  );
};

export default BotResponse;
