import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, AlertCircle, FileText, ChevronDown, ChevronUp, BarChart } from "lucide-react";

export default function EnhancedSummary({ data }) {
  // Process the summary text for structured display
  const summaryText = data?.summary || '';
  const [expandedSections, setExpandedSections] = useState({});
  
  // Split the summary into sections based on uppercase headers
  const sections = [];
  let currentSection = { title: '', content: [] };
  
  // Process the summary text line by line
  const lines = summaryText.split('\n');
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Check if this is a header line
    if (
      (line.toUpperCase() === line && line.length > 0 && /[A-Z]/.test(line)) ||
      (i < lines.length - 1 && (lines[i + 1].match(/^=+$/) || lines[i + 1].match(/^-+$/)))
    ) {
      if (currentSection.title) {
        sections.push({...currentSection});
      }
      
      currentSection = { title: line, content: [] };
      
      if (i < lines.length - 1 && (lines[i + 1].match(/^=+$/) || lines[i + 1].match(/^-+$/))) {
        i += 2;
      } else {
        i += 1;
      }
    } else if (line.length > 0) {
      currentSection.content.push(line);
      i += 1;
    } else {
      i += 1;
    }
  }
  
  // Add the last section
  if (currentSection.title) {
    sections.push(currentSection);
  }

  // Process sections for better display
  const processedSections = sections.map((section, index) => {
    const content = section.content;
    let processedContent = [];
    
    // Process each line based on patterns
    content.forEach(line => {
      if (line.startsWith('  -') || line.startsWith('- ')) {
        processedContent.push({ type: 'bullet', text: line.replace(/^(\s*-\s*)/, '') });
      } 
      else if (line.match(/^\d+\./)) {
        processedContent.push({ type: 'numbered', text: line.trim() });
      } 
      else if (line.endsWith(':')) {
        processedContent.push({ type: 'header', text: line });
      }
      else if (line.includes(':')) {
        const [key, value] = line.split(':', 2);
        processedContent.push({ type: 'key-value', key: key.trim(), value: value.trim() });
      } 
      else {
        processedContent.push({ type: 'paragraph', text: line });
      }
    });
    
    return {
      id: `section-${index}`,
      title: section.title,
      content: processedContent
    };
  });

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Helper function to determine section icon
  const getSectionIcon = (title) => {
    title = title.toLowerCase();
    if (title.includes('risk') || title.includes('issue') || title.includes('warning')) {
      return <AlertCircle className="h-4 w-4 text-amber-600" />;
    } else if (title.includes('recommend') || title.includes('action')) {
      return <CircleCheck className="h-4 w-4 text-green-600" />;
    } else {
      return <BarChart className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-700" />
            <CardTitle className="text-blue-800">Financial Summary</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 p-0">
        <div className="divide-y">
          {processedSections.map((section) => {
            const isExpanded = expandedSections[section.id] !== false; // Default to expanded
            
            return (
              <div key={section.id} className="py-2 px-4">
                <button 
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between p-2 text-left font-medium hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {getSectionIcon(section.title)}
                    <h3 className="text-md font-bold text-gray-800">{section.title}</h3>
                  </div>
                  {isExpanded ? 
                    <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                    <ChevronDown className="h-4 w-4  text-gray-500" />
                  }
                </button>
                
                {isExpanded && (
                  <div className="space-y-2 p-2 pl-6 mt-1 bg-gray-50 rounded-md">
                    {section.content.map((item, itemIndex) => {
                      switch (item.type) {
                        case 'bullet':
                          return (
                            <div key={itemIndex} className="flex items-start gap-2">
                              <CircleCheck className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                              <p className="text-sm text-gray-700">{item.text}</p>
                            </div>
                          );
                        
                        case 'numbered':
                          return (
                            <p key={itemIndex} className="text-sm text-gray-700 pl-6 relative">
                              {item.text}
                            </p>
                          );
                        
                        case 'header':
                          return (
                            <h4 key={itemIndex} className="font-medium text-sm text-gray-900">
                              {item.text}
                            </h4>
                          );
                        
                        case 'key-value':
                          return (
                            <div key={itemIndex} className="flex flex-row items-center text-sm">
                              <span className="text-gray-600 font-medium w-32">{item.key}:</span>
                              <span className="text-gray-900">{item.value}</span>
                            </div>
                          );
                        
                        case 'paragraph':
                          return (
                            <p key={itemIndex} className="text-sm text-gray-700">
                              {item.text}
                            </p>
                          );
                        
                        default:
                          return null;
                      }
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-4 border-t bg-amber-50">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700">
              This analysis is based on historical data. For personalized advice, consult a licensed professional.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}