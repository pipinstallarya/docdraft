import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiEdit2, FiEye, FiCopy, FiSend } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import { usePresentationMode } from '../context/PresentationContext';
import { extractTitleFromContent } from '../utils/helpers';
import { contentService } from '../services/ai';

interface EditorProps {
  onSave: () => void;
}

const Editor: React.FC<EditorProps> = ({ onSave }) => {
  const { state, updateDocument } = useAppContext();
  const { isPresentationMode } = usePresentationMode();

  const [isPreview, setIsPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const promptInputRef = useRef<HTMLInputElement>(null);

  const currentDocument = state.documents.find(
    doc => doc.id === state.currentDocumentId
  );

  // Focus textarea when switching documents
  useEffect(() => {
    if (currentDocument && !isPreview && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentDocument, isPreview]);

  // Focus prompt input when showing it
  useEffect(() => {
    if (showPrompt && promptInputRef.current) {
      promptInputRef.current.focus();
    }
  }, [showPrompt]);

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!currentDocument) return;

    const newContent = e.target.value;
    const title = extractTitleFromContent(newContent) || currentDocument.title;

    updateDocument({
      ...currentDocument,
      content: newContent,
      title
    });
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save the document with Ctrl/Cmd+S, allow this even with modifiers
    if (e.key === 'S' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSave();
      return;
    }

    // Skip other shortcuts when common modifiers are pressed
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) return;

    // Inline AI generation with Shift+Enter
    if (e.key === 'Enter' && e.shiftKey && !isPreview) {
      e.preventDefault();

      if (!currentDocument) return;

      // Get cursor position
      const textarea = textareaRef.current;
      if (!textarea) return;

      const cursorPosition = textarea.selectionStart;
      const textBefore = currentDocument.content.substring(0, cursorPosition);
      const textAfter = currentDocument.content.substring(cursorPosition);

      // Extract the current line or paragraph as the prompt
      const lines = textBefore.split('\n');
      const currentLine = lines[lines.length - 1].trim();

      if (!currentLine) return; // Don't generate if the line is empty

      // Set the current line as the prompt and generate content
      setIsGenerating(true);

      contentService.generateSuggestions(currentLine)
        .then(generatedContent => {
          // Insert the generated content after the current position
          const newContent = `${textBefore}\n\n${generatedContent}\n\n${textAfter}`;

          const title = extractTitleFromContent(newContent) || currentDocument.title;

          updateDocument({
            ...currentDocument,
            content: newContent,
            title
          });

          // After update, set cursor position after the generated content
          setTimeout(() => {
            if (textarea) {
              const newPosition = textBefore.length + generatedContent.length + 4; // +4 for the newlines
              textarea.focus();
              textarea.setSelectionRange(newPosition, newPosition);
            }
          }, 50);
        })
        .catch(error => {
          console.error('Error generating content:', error);
          alert('There was an error generating content. Please try again.');
        })
        .finally(() => {
          setIsGenerating(false);
        });
    }

    // We'll keep the Tab shortcut as an alternative for opening the prompt popup
    if (e.key === 'Tab' && !e.shiftKey && !showPrompt && !isPreview) {
      e.preventDefault();
      setShowPrompt(true);
    }
  };

  // Generate content with AI
  const generateContent = async () => {
    if (!currentDocument || !prompt.trim()) return;

    try {
      setIsGenerating(true);

      // Get the content from the AI service
      const generatedContent = await contentService.generateSuggestions(prompt);

      // Add the generated content to the document
      const newContent = currentDocument.content
        ? `${currentDocument.content}\n\n${generatedContent}`
        : generatedContent;

      // Update document with the new content
      const title = extractTitleFromContent(newContent) || currentDocument.title;

      updateDocument({
        ...currentDocument,
        content: newContent,
        title
      });

      // Reset and close prompt
      setPrompt('');
      setShowPrompt(false);
    } catch (error) {
      console.error('Error generating content:', error);
      alert('There was an error generating content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle prompt submission
  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateContent();
  };

  // Handle prompt cancel
  const handlePromptCancel = () => {
    setPrompt('');
    setShowPrompt(false);
  };

  if (!currentDocument) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500">
        <p>Select a document or create a new one</p>
      </div>
    );
  }

  // Different labels for presentation mode
  const editorPlaceholder = isPresentationMode
    ? 'Add your content here...'
    : 'Start typing or use Tab to get suggestions...';

  const promptPlaceholder = isPresentationMode
    ? 'Enter text to get structured content...'
    : 'What content would you like to generate?';

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`p-1.5 rounded-md flex items-center space-x-1 text-sm ${
              isPreview ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'
            }`}
            title={isPreview ? "Edit mode" : "Preview mode"}
          >
            {isPreview ? (
              <>
                <FiEdit2 className="w-4 h-4" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <FiEye className="w-4 h-4" />
                <span>Preview</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(currentDocument.content);
            }}
            className="p-1.5 rounded-md hover:bg-gray-200 flex items-center space-x-1 text-sm"
            title="Copy content"
          >
            <FiCopy className="w-4 h-4" />
            <span>Copy</span>
          </button>
        </div>

        {!isPreview && (
          <button
            onClick={() => setShowPrompt(true)}
            className="p-1.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center space-x-1 text-sm"
            title={isPresentationMode ? "Enhance content" : "Open suggestions dialog (or use Shift+Enter for inline generation)"}
          >
            <FiSend className="w-4 h-4" />
            <span>{isPresentationMode ? "Enhance" : "Suggest"}</span>
          </button>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto">
        {isPreview ? (
          <div className="p-6 max-w-3xl mx-auto prose">
            <ReactMarkdown>{currentDocument.content}</ReactMarkdown>
          </div>
        ) : (
          <div className="relative h-full">
            <div className="relative h-full w-full">
              <textarea
                ref={textareaRef}
                value={currentDocument.content}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                placeholder={editorPlaceholder}
                className="w-full h-full p-6 resize-none border-none focus:ring-0 focus:outline-none bg-white dark:bg-gray-900 dark:text-gray-100"
                spellCheck="true"
                disabled={isGenerating}
              />
              {isGenerating && (
                <div className="absolute bottom-4 right-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </div>
              )}
            </div>

            {/* AI prompt overlay */}
            {showPrompt && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-lg mx-auto">
                  <h3 className="text-lg font-medium mb-3 text-gray-800">
                    {isPresentationMode ? "Enhance Content" : "Generate Content"}
                  </h3>

                  <form onSubmit={handlePromptSubmit}>
                    <input
                      ref={promptInputRef}
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={promptPlaceholder}
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handlePromptCancel();
                        }
                      }}
                    />

                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={handlePromptCancel}
                        className="px-3 py-1.5 border border-gray-300 rounded text-sm"
                        disabled={isGenerating}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                        disabled={!prompt.trim() || isGenerating}
                      >
                        {isGenerating ? 'Generating...' : 'Generate'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
