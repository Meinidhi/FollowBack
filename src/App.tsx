import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DownloadInstructions } from './components/DownloadInstructions';
import { UploadSection } from './components/UploadSection';
import { UploadProgress } from './components/UploadProgress';
import { PrivacyNotice } from './components/PrivacyNotice';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AnalysisResult, ProcessingError, InstagramUser } from './types/instagram';
import { processInstagramZip } from './utils/zipProcessor';
import { compareFollowLists } from './utils/comparisonEngine';
import { formatTimestamp, getProfileUrl } from './utils/usernameNormalizer';

export const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState<ProcessingError | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Scroll Helpers
  const scrollToUpload = () => {
    const el = document.getElementById('upload-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToInstructions = () => {
    const el = document.getElementById('download-instructions');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle File Selection
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleClearSelectedFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  // Start Real ZIP Analysis
  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);
    setProgressStep('Initializing analysis...');
    setProgressPercent(10);

    try {
      const extracted = await processInstagramZip(selectedFile, (step, percent) => {
        setProgressStep(step);
        setProgressPercent(percent);
      });

      const analysis = compareFollowLists(
        extracted.followers,
        extracted.following,
        {
          fileName: selectedFile.name,
          fileSize: selectedFile.size
        }
      );

      // Brief delay so progress bar looks smooth
      setTimeout(() => {
        setIsProcessing(false);
        setResult(analysis);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);

    } catch (err: unknown) {
      setIsProcessing(false);
      const procErr = err as ProcessingError;
      if (procErr && procErr.type) {
        setError(procErr);
      } else {
        setError({
          type: 'generic',
          title: 'Analysis Error',
          message: err instanceof Error ? err.message : 'An unexpected error occurred while parsing your archive.'
        });
      }
    }
  };

  // Load Demo Data for Immediate Previewing
  const handleLoadDemoData = () => {
    setIsProcessing(true);
    setProgressStep('Generating sample dataset...');
    setProgressPercent(40);

    const nowSec = Math.floor(Date.now() / 1000);

    const sampleFollowingUsernames = [
      'natgeo', 'nasa', 'cristiano', 'leomessi', 'taylorswift',
      'alex_travels', 'sophie.bakes', 'marcus_design', 'elena_runner',
      'tech_insider', 'lucas_codes', 'mia_art_studio', 'david_music',
      'sarah_fit', 'samuel_photo', 'emma_reads', 'jordan_skate',
      'chloe_style', 'kevin_coffee', 'olivia_garden', 'liam_beats',
      'maya_illustrates', 'ryan_drift', 'zack_gametime', 'zoe_yoga',
      'ethan_adventures', 'nina_crafts', 'ben_guitars', 'claire_cafe',
      'daniel_cycling', 'amber_sky', 'felix_dev', 'hannah_writer'
    ];

    const sampleFollowersUsernames = [
      'alex_travels', 'sophie.bakes', 'marcus_design', 'elena_runner',
      'lucas_codes', 'mia_art_studio', 'david_music', 'emma_reads',
      'kevin_coffee', 'olivia_garden', 'zoe_yoga', 'ben_guitars',
      'daniel_cycling', 'felix_dev',
      // Fans (follow you, but you don't follow back)
      'fan_photography_99', 'random_memes_daily', 'guitar_lover_101',
      'crypto_daily_news', 'art_collector_feed', 'vintage_cars_world',
      'wanderlust_traveler', 'street_food_delights'
    ];

    const following: InstagramUser[] = sampleFollowingUsernames.map((u, i) => ({
      username: u,
      normalizedUsername: u.toLowerCase(),
      profileUrl: getProfileUrl(u),
      timestamp: nowSec - (i + 1) * 86400 * 3,
      dateFollowed: formatTimestamp(nowSec - (i + 1) * 86400 * 3)
    }));

    const followers: InstagramUser[] = sampleFollowersUsernames.map((u, i) => ({
      username: u,
      normalizedUsername: u.toLowerCase(),
      profileUrl: getProfileUrl(u),
      timestamp: nowSec - (i + 1) * 86400 * 4,
      dateFollowed: formatTimestamp(nowSec - (i + 1) * 86400 * 4)
    }));

    setTimeout(() => {
      setProgressStep('Calculating comparison lists...');
      setProgressPercent(90);

      const analysis = compareFollowLists(followers, following, {
        fileName: 'instagram-demo-export.zip',
        fileSize: 48520
      });

      setTimeout(() => {
        setIsProcessing(false);
        setResult(analysis);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 400);
    }, 500);
  };

  // Reset Everything (Clear Data button per Section 14)
  const handleClearData = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setIsProcessing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar
        hasResults={result !== null}
        onClearData={handleClearData}
        onNavigateToUpload={scrollToUpload}
        onNavigateToInstructions={scrollToInstructions}
      />

      <main className="flex-1">
        {result ? (
          <ResultsDashboard
            result={result}
            onClearData={handleClearData}
          />
        ) : (
          <>
            <Hero
              onPrimaryClick={scrollToInstructions}
              onSecondaryClick={scrollToInstructions}
            />

            <DownloadInstructions
              onProceedToUpload={scrollToUpload}
            />

            <UploadSection
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              onClearSelectedFile={handleClearSelectedFile}
              onStartAnalysis={handleStartAnalysis}
              onLoadDemoData={handleLoadDemoData}
              onViewInstructions={scrollToInstructions}
              isProcessing={isProcessing}
              error={error}
            />

            <PrivacyNotice />

            <FAQ />
          </>
        )}
      </main>

      {isProcessing && (
        <UploadProgress
          step={progressStep}
          percent={progressPercent}
        />
      )}

      <Footer />
    </div>
  );
};

export default App;
