import { useRef, useState } from "react";

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success

function copyText(text: string) {
  // creating textarea of html
  const input = document.createElement("textarea");
  //adding p tag text to textarea
  input.value = text;
  // Avoid scrolling to bottom
  input.style.position = "fixed";
  input.style.top = "-99999px";
  input.style.left = "-99999px";
  document.body.appendChild(input);
  input.select();
  document.execCommand("Copy");
  // removing textarea after copy
  input.remove();

  return true;
}

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>("");
  const timeOut = useRef<ReturnType<typeof setTimeout>>();

  const copy: CopyFn = async (text) => {
    if (!document.execCommand) {
      console.warn("Clipboard not supported");
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      if (timeOut.current) {
        clearTimeout(timeOut.current);
      }
      copyText(text);
      setCopiedText(text);

      timeOut.current = setTimeout(() => {
        setCopiedText(null);
      }, 500);
      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copy];
}
