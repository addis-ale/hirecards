'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import ClarityScoreModal from './ClarityScoreModal';

interface JobURLInputProps {
  onDataExtracted: (data: any) => void;
}

export default function JobURLInput({ onDataExtracted }: JobURLInputProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showClarityModal, setShowClarityModal] = useState(false);
  const [clarityData, setClarityData] = useState<any>(null);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a job URL');
      return;
    }

    // Basic URL validation
    if (!url.includes('http') && !url.includes('www.')) {
      setError('Please enter a valid URL (e.g., https://...)');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/scrape-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        // Check if this is an irrelevant URL (confidence 0 or no data extracted)
        const hasData = result.data && (
          result.data.roleTitle || 
          result.data.department || 
          result.data.criticalSkills?.length > 0 ||
          result.data.location ||
          result.data.workModel
        );
        
        if (!hasData || result.data.confidence === 0) {
          // Irrelevant URL detected
          setError('⚠️ That URL doesn\'t look like a job posting. Try a different link or just type the role details.');
          onDataExtracted(result.data); // Still pass data (will be empty) to trigger chat response
        } else {
          // Calculate clarity score
          const fieldsCount = {
            roleTitle: result.data.roleTitle ? 1 : 0,
            department: result.data.department ? 1 : 0,
            experienceLevel: result.data.experienceLevel ? 1 : 0,
            location: result.data.location ? 1 : 0,
            workModel: result.data.workModel ? 1 : 0,
            criticalSkills: result.data.criticalSkills?.length > 0 ? 1 : 0,
            salary: (result.data.minSalary && result.data.maxSalary) ? 1 : 0,
            nonNegotiables: result.data.nonNegotiables ? 1 : 0,
            timeline: result.data.timeline ? 1 : 0,
            flexible: result.data.flexible ? 1 : 0,
          };
          
          const filledFields = Object.values(fieldsCount).reduce((a, b) => a + b, 0);
          const totalFields = 10;
          const score = Math.round((filledFields / totalFields) * 100);
          
          // Get missing fields
          const missingFields = [];
          if (!result.data.roleTitle) missingFields.push('Role Title');
          if (!result.data.department) missingFields.push('Department');
          if (!result.data.experienceLevel) missingFields.push('Experience Level');
          if (!result.data.location) missingFields.push('Location');
          if (!result.data.workModel) missingFields.push('Work Model');
          if (!result.data.criticalSkills || result.data.criticalSkills.length === 0) missingFields.push('Critical Skills');
          if (!result.data.minSalary || !result.data.maxSalary) missingFields.push('Salary Range');
          if (!result.data.nonNegotiables) missingFields.push('Non-Negotiables');
          if (!result.data.timeline) missingFields.push('Timeline');
          if (!result.data.flexible) missingFields.push('Nice-to-Have Skills');
          
          // Generate category and message
          let category = '';
          let message = '';
          
          if (score >= 90) {
            category = 'Crystal Clear';
            message = `Wow! Look at you with a clarity score of ${score}/100—you actually know what you're doing! This is rare. Like, unicorn-level rare. We've got everything we need to build you a killer HireCard. Let's make this happen.`;
          } else if (score >= 70) {
            category = 'Moderate-High Clarity';
            message = `Oh, look at you with a clarity score of ${score}/100—it's like you almost know what you're doing! But spoiler alert: those missing fields are the equivalent of leaving the house without pants. Sure, you might get lucky and have someone show up, but good luck convincing them that your undefined expectations are worth their time!`;
          } else if (score >= 50) {
            category = 'Moderate Clarity';
            message = `Clarity score: ${score}/100. So... you're halfway there. Congrats, I guess? But here's the thing: you're asking people to apply for a role where half the details are a mystery. It's like selling a car and saying "it has wheels... probably." Fill in the gaps, or prepare for confusion and ghosting.`;
          } else {
            category = 'Low Clarity';
            message = `Yikes. ${score}/100. That's not a clarity score—that's a cry for help. You've given us so little information that even AI is confused. And trust me, that's saying something. If you want actual candidates (not psychics), you need to fill in these blanks. All of them.`;
          }
          
          setClarityData({
            score,
            category,
            message,
            missingFields,
            data: result.data,
          });
          
          setSuccess(true);
          setShowClarityModal(true);
          
          // Reset URL after a delay
          setTimeout(() => {
            setUrl('');
            setSuccess(false);
          }, 2000);
        }
      } else {
        setError(result.error || 'Failed to scrape job URL');
      }
    } catch (err) {
      console.error('Scraping error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteFields = () => {
    // Pass data to chatbot and close clarity modal
    setShowClarityModal(false);
    if (clarityData) {
      onDataExtracted(clarityData.data);
    }
  };

  const handleGenerateAnyway = () => {
    // Pass data to chatbot, close modal, and trigger generation
    setShowClarityModal(false);
    if (clarityData) {
      onDataExtracted(clarityData.data);
      // Trigger generation flow
      setTimeout(() => {
        const formData = {
          roleTitle: clarityData.data.roleTitle || "",
          department: clarityData.data.department || "",
          experienceLevel: clarityData.data.experienceLevel || "",
          location: clarityData.data.location || "",
          workModel: clarityData.data.workModel || "",
          criticalSkills: clarityData.data.criticalSkills || [],
          minSalary: clarityData.data.minSalary || "",
          maxSalary: clarityData.data.maxSalary || "",
          nonNegotiables: clarityData.data.nonNegotiables || "",
          flexible: clarityData.data.flexible || "",
          timeline: clarityData.data.timeline || "",
        };
        sessionStorage.setItem("formData", JSON.stringify(formData));
        window.location.href = "/results";
      }, 500);
    }
  };

  return (
    <>
      {/* Clarity Score Modal */}
      {clarityData && (
        <ClarityScoreModal
          isOpen={showClarityModal}
          onClose={() => setShowClarityModal(false)}
          score={clarityData.score}
          category={clarityData.category}
          message={clarityData.message}
          missingFields={clarityData.missingFields}
          onCompleteFields={handleCompleteFields}
          onGenerateAnyway={handleGenerateAnyway}
        />
      )}

      <div className="mb-2">
        <form onSubmit={handleScrape}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Just drop your job description here"
              disabled={isLoading || success}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={!url.trim() || isLoading || success}
            className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Done!
              </>
            ) : (
              'Analyze'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-green-800">
                Successfully analyzed job details!
              </p>
            </div>
          </div>
        )}
      </form>
      </div>
    </>
  );
}
