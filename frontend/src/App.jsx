import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import StoryForm from './components/StoryForm';
import LoadingState from './components/LoadingState';
import StoryView from './components/StoryView';
import Quiz from './components/Quiz';
import Result from './components/Result';
import CertificateModal from './components/CertificateModal';
import StoryHistoryModal from './components/StoryHistoryModal';
import AgeLensModal from './components/AgeLensModal';
import TeacherWorksheetModal from './components/TeacherWorksheetModal';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import AnalyticsDashboardModal from './components/AnalyticsDashboardModal';
import TrophyRoomModal from './components/TrophyRoomModal';
import MagicWordLabModal from './components/MagicWordLabModal';
import StoryTheaterModal from './components/StoryTheaterModal';
import ComicStripModal from './components/ComicStripModal';
import SuggestedResourcesModal from './components/SuggestedResourcesModal';
import StreakModal from './components/StreakModal';
import PresetsModal from './components/PresetsModal';
import Footer from './components/Footer';

import { getStory, getQuiz, evaluateQuiz } from './services/api';
import { playSuccessChime } from './services/soundEffects';

const STEP_FORM = 'form';
const STEP_LOADING_STORY = 'loading_story';
const STEP_STORY = 'story';
const STEP_LOADING_QUIZ = 'loading_quiz';
const STEP_QUIZ = 'quiz';
const STEP_LOADING_EVAL = 'loading_eval';
const STEP_RESULT = 'result';

const STORAGE_KEY = 'story_teacher_history_v1';
const XP_KEY = 'story_teacher_xp_v1';
const USER_KEY = 'story_teacher_user_v1';

export default function App() {
  const [currentStep, setCurrentStep] = useState(STEP_FORM);
  const [errorMessage, setErrorMessage] = useState("");

  // User Profile & Authentication
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Gamification XP
  const [xp, setXp] = useState(150);

  // Current session parameters
  const [currentTopic, setCurrentTopic] = useState("");
  const [currentAgeGroup, setCurrentAgeGroup] = useState("5-7");
  const [currentLanguage, setCurrentLanguage] = useState("English");

  // AI Content
  const [storyData, setStoryData] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [evalResult, setEvalResult] = useState(null);

  // Modals
  const [showCertificate, setShowCertificate] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAgeLens, setShowAgeLens] = useState(false);
  const [showTeacherMode, setShowTeacherMode] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showTrophiesModal, setShowTrophiesModal] = useState(false);
  const [showMagicWordLab, setShowMagicWordLab] = useState(false);
  const [selectedWordForLab, setSelectedWordForLab] = useState(null);
  const [showStoryTheater, setShowStoryTheater] = useState(false);
  const [showComicStrip, setShowComicStrip] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [history, setHistory] = useState([]);

  // Load history, user, & XP from localStorage on startup
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) setHistory(JSON.parse(savedHistory));

      const savedXp = localStorage.getItem(XP_KEY);
      if (savedXp) setXp(parseInt(savedXp, 10));
    } catch (e) {
      // Ignore
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.xp) setXp(user.xp);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(USER_KEY);
    } catch (e) {}
  };

  const addXp = (amount) => {
    setXp((prev) => {
      const updated = prev + amount;
      try {
        localStorage.setItem(XP_KEY, String(updated));
        if (currentUser) {
          const updatedUser = { ...currentUser, xp: updated };
          setCurrentUser(updatedUser);
          localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        }
      } catch (e) {}
      return updated;
    });
  };

  const saveToHistory = (item) => {
    try {
      const updated = [item, ...history.slice(0, 9)];
      setHistory(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      // Ignore
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById('story-form-card') || document.getElementById('main-content');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Submit Story Creation
  const handleCreateStory = async ({ topic, age_group, language, length }) => {
    setErrorMessage("");
    setCurrentTopic(topic);
    setCurrentAgeGroup(age_group);
    setCurrentLanguage(language);
    setCurrentStep(STEP_LOADING_STORY);

    try {
      const data = await getStory({ topic, age_group, language, length });
      setStoryData(data);
      addXp(50); // +50 XP for reading a new story!
      playSuccessChime();
      setCurrentStep(STEP_STORY);

      saveToHistory({
        topic,
        ageGroup: age_group,
        language,
        storyData: data,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to create story. Please try again.");
      setCurrentStep(STEP_FORM);
    }
  };

  // 2. Fetch Quiz from Story
  const handleTakeQuiz = async () => {
    if (!storyData || !storyData.story) return;
    setErrorMessage("");
    setCurrentStep(STEP_LOADING_QUIZ);

    try {
      const data = await getQuiz({
        story: storyData.story,
        age_group: currentAgeGroup,
        language: currentLanguage
      });
      setQuizData(data.questions || []);
      setCurrentStep(STEP_QUIZ);
    } catch (err) {
      setErrorMessage(err.message || "Failed to generate quiz. Please try again.");
      setCurrentStep(STEP_STORY);
    }
  };

  // 3. Evaluate Quiz Answers
  const handleSubmitQuiz = async (userAnswers) => {
    setErrorMessage("");
    setCurrentStep(STEP_LOADING_EVAL);

    try {
      const data = await evaluateQuiz({
        story: storyData.story,
        questions: quizData,
        user_answers: userAnswers,
        age_group: currentAgeGroup,
        language: currentLanguage
      });
      setEvalResult(data);
      addXp(100); // +100 XP for completing comprehension quiz!
      setCurrentStep(STEP_RESULT);
    } catch (err) {
      setErrorMessage(err.message || "Failed to evaluate answers. Please try again.");
      setCurrentStep(STEP_QUIZ);
    }
  };

  // Select story directly from AgeLensModal comparison
  const handleSelectStoryFromAgeLens = (selectedStory, ageGrp) => {
    setCurrentTopic(currentTopic || "The Water Cycle");
    setCurrentAgeGroup(ageGrp);
    setStoryData(selectedStory);
    setCurrentStep(STEP_STORY);
  };

  // Reset to form
  const handleResetToForm = () => {
    setCurrentStep(STEP_FORM);
    setErrorMessage("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadAgain = () => {
    setCurrentStep(STEP_STORY);
  };

  const handleSelectHistoryItem = (item) => {
    setCurrentTopic(item.topic);
    setCurrentAgeGroup(item.ageGroup);
    setCurrentLanguage(item.language);
    setStoryData(item.storyData);
    setCurrentStep(STEP_STORY);
  };

  const handleSelectPreset = (preset) => {
    setCurrentTopic(preset.topic);
    setCurrentAgeGroup(preset.age_group);
    setCurrentLanguage(preset.language || "English");
    handleCreateStory({
      topic: preset.topic,
      age_group: preset.age_group,
      language: preset.language || "English",
      length: "medium"
    });
  };

  // Stepper progress index
  const getStepProgressIndex = () => {
    if (currentStep === STEP_FORM || currentStep === STEP_LOADING_STORY) return 1;
    if (currentStep === STEP_STORY || currentStep === STEP_LOADING_QUIZ) return 2;
    if (currentStep === STEP_QUIZ || currentStep === STEP_LOADING_EVAL) return 3;
    if (currentStep === STEP_RESULT) return 4;
    return 1;
  };

  const progressIndex = getStepProgressIndex();

  return (
    <>
      <div className="bg-decor" />

      <Navbar 
        onOpenHistory={() => setShowHistory(true)}
        onReset={handleResetToForm}
        hasHistory={history.length > 0}
        onOpenAgeLens={() => setShowAgeLens(true)}
        xp={xp}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenAnalytics={() => setShowAnalyticsModal(true)}
        onOpenTrophies={() => setShowTrophiesModal(true)}
        onOpenResources={() => setShowResourcesModal(true)}
        onOpenFlashcards={() => {
          setSelectedWordForLab(storyData?.vocabulary?.[0] || null);
          setShowMagicWordLab(true);
        }}
        onOpenTeacherMode={() => setShowTeacherMode(true)}
        onOpenPresets={() => setShowPresetsModal(true)}
        onOpenStreak={() => setShowStreakModal(true)}
        activeTab={currentStep === STEP_FORM ? "studio" : "reader"}
      />

      <main className="app-container" id="main-content" style={{ flex: 1, paddingBottom: '3rem' }}>
        {/* Hero on Form step */}
        {currentStep === STEP_FORM && (
          <Hero 
            onStartLearning={scrollToForm}
            onScrollToHowItWorks={scrollToHowItWorks}
          />
        )}

        {/* Stepper indicator bar */}
        <div className="stepper" style={{ marginTop: currentStep === STEP_FORM ? '1rem' : '2rem' }}>
          <div className={`step-item ${progressIndex === 1 ? 'active' : progressIndex > 1 ? 'completed' : ''}`}>
            1. Topic & Age
          </div>
          <div className="step-connector" />
          <div className={`step-item ${progressIndex === 2 ? 'active' : progressIndex > 2 ? 'completed' : ''}`}>
            2. Story & Words
          </div>
          <div className="step-connector" />
          <div className={`step-item ${progressIndex === 3 ? 'active' : progressIndex > 3 ? 'completed' : ''}`}>
            3. Comprehension Quiz
          </div>
          <div className="step-connector" />
          <div className={`step-item ${progressIndex === 4 ? 'active' : ''}`}>
            4. AI Feedback
          </div>
        </div>

        {/* Step 1: Form */}
        {currentStep === STEP_FORM && (
          <>
            <StoryForm 
              onSubmit={handleCreateStory}
              isLoading={false}
              errorMessage={errorMessage}
              onClearError={() => setErrorMessage("")}
              onOpenAgeLens={(t) => {
                if (t) setCurrentTopic(t);
                setShowAgeLens(true);
              }}
            />
            <HowItWorks />
          </>
        )}

        {/* Loading Story */}
        {currentStep === STEP_LOADING_STORY && (
          <LoadingState type="story" />
        )}

        {/* Step 2: Story View */}
        {currentStep === STEP_STORY && storyData && (
          <StoryView 
            storyData={storyData}
            topic={currentTopic}
            ageGroup={currentAgeGroup}
            language={currentLanguage}
            onTakeQuiz={handleTakeQuiz}
            onBackToForm={handleResetToForm}
            isLoadingQuiz={false}
            onOpenTeacherMode={() => setShowTeacherMode(true)}
            onAddXp={addXp}
            onOpenTheater={() => setShowStoryTheater(true)}
            onOpenComic={() => setShowComicStrip(true)}
            onOpenWordLab={(w) => {
              setSelectedWordForLab(w);
              setShowMagicWordLab(true);
            }}
            onOpenResources={() => setShowResourcesModal(true)}
          />
        )}

        {/* Loading Quiz */}
        {currentStep === STEP_LOADING_QUIZ && (
          <LoadingState type="quiz" />
        )}

        {/* Step 3: Interactive Quiz */}
        {currentStep === STEP_QUIZ && (
          <Quiz 
            questions={quizData}
            onSubmitQuiz={handleSubmitQuiz}
            isEvaluating={false}
            onBackToStory={() => setCurrentStep(STEP_STORY)}
          />
        )}

        {/* Loading Evaluation */}
        {currentStep === STEP_LOADING_EVAL && (
          <LoadingState type="evaluate" />
        )}

        {/* Step 4: Results & AI Evaluation */}
        {currentStep === STEP_RESULT && evalResult && (
          <Result 
            evalResult={evalResult}
            storyData={storyData}
            topic={currentTopic}
            ageGroup={currentAgeGroup}
            onNewStory={handleResetToForm}
            onReadAgain={handleReadAgain}
            onOpenCertificate={() => setShowCertificate(true)}
          />
        )}
      </main>

      {/* Certificate Modal */}
      {showCertificate && evalResult && (
        <CertificateModal 
          topic={currentTopic}
          scorePercentage={Math.round(evalResult.percentage || 0)}
          badgeTitle={evalResult.badge || "Star Learner 🌟"}
          initialName={currentUser?.name || "Curious Learner"}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* History Modal */}
      {showHistory && (
        <StoryHistoryModal 
          history={history}
          onSelectStory={handleSelectHistoryItem}
          onClearHistory={clearHistory}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Side-by-Side Age Lens Comparison Modal for Judges */}
      {showAgeLens && (
        <AgeLensModal 
          topic={currentTopic || "The Water Cycle"}
          onSelectStory={handleSelectStoryFromAgeLens}
          onClose={() => setShowAgeLens(false)}
        />
      )}

      {/* Teacher & Classroom Worksheet Modal */}
      {showTeacherMode && storyData && (
        <TeacherWorksheetModal 
          storyData={storyData}
          topic={currentTopic}
          ageGroup={currentAgeGroup}
          quizQuestions={quizData}
          onClose={() => setShowTeacherMode(false)}
        />
      )}

      {/* Auth Modal (Sign in / Register) */}
      {showAuthModal && (
        <AuthModal 
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* User Profile Modal */}
      {showProfileModal && currentUser && (
        <UserProfileModal 
          user={currentUser}
          onLogout={handleLogout}
          onOpenTeacherMode={() => setShowTeacherMode(true)}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Analytics Dashboard Modal */}
      {showAnalyticsModal && (
        <AnalyticsDashboardModal
          user={currentUser}
          onSelectTopic={(topicName) => {
            setCurrentTopic(topicName);
            handleResetToForm();
          }}
          onClose={() => setShowAnalyticsModal(false)}
        />
      )}

      {/* Trophy Room Modal (Hall of Fame) */}
      {showTrophiesModal && (
        <TrophyRoomModal 
          user={currentUser}
          xp={xp}
          onClose={() => setShowTrophiesModal(false)}
        />
      )}

      {/* Magic Word Lab (Phonics & Child Syllables) */}
      {showMagicWordLab && (
        <MagicWordLabModal 
          initialWord={selectedWordForLab}
          vocabularyList={storyData?.vocabulary || []}
          onClose={() => setShowMagicWordLab(false)}
          onAddXp={addXp}
        />
      )}

      {/* Bedtime & Cinema Storybook Theater Mode */}
      {showStoryTheater && storyData && (
        <StoryTheaterModal 
          storyData={storyData}
          topic={currentTopic}
          ageGroup={currentAgeGroup}
          onClose={() => setShowStoryTheater(false)}
          onAddXp={addXp}
        />
      )}

      {/* Graphic Novel Comic Strip Modal */}
      {showComicStrip && storyData && (
        <ComicStripModal 
          storyData={storyData}
          topic={currentTopic}
          ageGroup={currentAgeGroup}
          onClose={() => setShowComicStrip(false)}
          onAddXp={addXp}
        />
      )}

      {/* Suggested STEM Books & Marketplace Explorer (Amazon, Flipkart, Google) */}
      {showResourcesModal && (
        <SuggestedResourcesModal 
          topic={currentTopic || "The Water Cycle"}
          ageGroup={currentAgeGroup}
          onClose={() => setShowResourcesModal(false)}
          onAddXp={addXp}
        />
      )}

      {/* Streak Celebration Modal */}
      {showStreakModal && (
        <StreakModal 
          streak={currentUser?.streak || 3}
          onClose={() => setShowStreakModal(false)}
          onAddXp={addXp}
        />
      )}

      {/* Benchmark STEM Story Presets Modal */}
      {showPresetsModal && (
        <PresetsModal 
          onSelectPreset={handleSelectPreset}
          onClose={() => setShowPresetsModal(false)}
        />
      )}

      <Footer onScrollToHowItWorks={scrollToHowItWorks} />
    </>
  );
}
