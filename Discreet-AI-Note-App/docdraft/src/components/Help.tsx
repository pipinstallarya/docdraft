import type React from 'react';
import { FiX } from 'react-icons/fi';
import { usePresentationMode } from '../context/PresentationContext';

interface HelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const Help: React.FC<HelpProps> = ({ isOpen, onClose }) => {
  const { isPresentationMode } = usePresentationMode();

  if (!isOpen) return null;

  // Different content based on presentation mode
  const title = isPresentationMode
    ? 'About DocDraft'
    : 'DocDraft Help & Information';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isPresentationMode ? (
            // Simplified "cover story" content for presentation mode
            <>
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2 text-gray-700">About DocDraft</h3>
                <p className="text-gray-600 mb-2">
                  DocDraft is a professional document drafting and organization tool designed to streamline your content creation workflow.
                </p>
                <p className="text-gray-600">
                  Created by Productivity Tools, Inc. Version 1.0.0
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-md font-medium mb-2 text-gray-700">Features</h3>
                <ul className="list-disc ml-6 text-gray-600 space-y-2">
                  <li>Organize documents and projects efficiently</li>
                  <li>Markdown support for rich document formatting</li>
                  <li>Enhancer tool for content structure suggestions</li>
                  <li>Local file export and backup</li>
                  <li>Dark mode and customizable interface</li>
                </ul>
              </div>

              <div>
                <h3 className="text-md font-medium mb-2 text-gray-700">Contact</h3>
                <p className="text-gray-600">
                  For support inquiries, please contact us at support@docdraft.example.com
                </p>
              </div>
            </>
          ) : (
            // Detailed actual help content
            <>
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2 text-gray-700">What is DocDraft?</h3>
                <p className="text-gray-600 mb-2">
                  DocDraft is a secure and private markdown editing tool with AI-powered content generation capabilities.
                  It stores all your content locally and uses OpenAI's API for document generation.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-md font-medium mb-2 text-gray-700">Getting Started</h3>
                <ol className="list-decimal ml-6 text-gray-600 space-y-2">
                  <li>
                    <strong>Configure your API key</strong> - Go to Settings and enter your OpenAI API key to enable content generation.
                  </li>
                  <li>
                    <strong>Create your first document</strong> - Use the "+" button in the sidebar or header to create a new document.
                  </li>
                  <li>
                    <strong>Organize with folders</strong> - Create folders to keep your documents organized.
                  </li>
                  <li>
                    <strong>Generate content</strong> - Use Shift+Enter to generate content inline based on the current line, or press Tab to open the AI content generator dialog.
                  </li>
                </ol>
              </div>

              <div className="mb-6">
                <h3 className="text-md font-medium mb-2 text-gray-700">Keyboard Shortcuts</h3>
                <div className="bg-gray-50 rounded p-4 text-sm">
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="font-medium">Shift + Enter</div>
                    <div>Generate content inline based on the current line</div>

                    <div className="font-medium">Tab</div>
                    <div>Open content generation prompt</div>

                    <div className="font-medium">Ctrl/Cmd + S</div>
                    <div>Save current document</div>

                    <div className="font-medium">Escape</div>
                    <div>Quick hide (when enabled in settings)</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-md font-medium mb-2 text-gray-700">Privacy & Security</h3>
                <ul className="list-disc ml-6 text-gray-600 space-y-2">
                  <li>All documents are stored locally in your browser</li>
                  <li>Your API key is encrypted before being stored</li>
                  <li>No data is sent to any server except OpenAI when generating content</li>
                  <li>Presentation mode hides sensitive information from onlookers</li>
                  <li>Quick escape feature allows you to quickly hide the application</li>
                </ul>
              </div>

              <div>
                <h3 className="text-md font-medium mb-2 text-gray-700">About</h3>
                <p className="text-gray-600">
                  Version 1.0.0 - Created for privacy-conscious content creation.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;
