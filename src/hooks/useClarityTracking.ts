import { useEffect } from 'react';
import clarity from '@microsoft/clarity';

const isClarityEnabled = () => {
  return typeof window !== 'undefined' && import.meta.env.VITE_CLARITY_PROJECT_ID;
};

export const ClarityTracker = {
  // User identification
  identifyUser: (userId: number | string) => {
    if (!isClarityEnabled()) return;
    clarity.identify(userId.toString());
  },

  // Quest tracking
  questStarted: (questId: number, questTitle: string, questType: string) => {
    if (!isClarityEnabled()) return;
    clarity.event('quest_started');
    clarity.setTag('current_quest_id', questId.toString());
    clarity.setTag('current_quest_title', questTitle);
    clarity.setTag('current_quest_type', questType);
  },

  questCompleted: (questId: number, accuracyRate: number, timeSpent: number) => {
    if (!isClarityEnabled()) return;
    clarity.event('quest_completed');
    clarity.setTag('quest_completed_id', questId.toString());
    clarity.setTag('quest_accuracy_rate', `${accuracyRate}%`);
    clarity.setTag('quest_time_spent', `${Math.round(timeSpent / 60)}min`);
  },

  questAbandoned: (questId: number, progressRate: number) => {
    if (!isClarityEnabled()) return;
    clarity.event('quest_abandoned');
    clarity.setTag('abandoned_quest_id', questId.toString());
    clarity.setTag('abandoned_at_progress', `${progressRate}%`);
  },

  // Answer tracking
  answerSubmitted: (isCorrect: boolean, attemptCount: number, questionType: string) => {
    if (!isClarityEnabled()) return;
    clarity.event(isCorrect ? 'answer_correct' : 'answer_wrong');
    clarity.setTag('attempt_count', attemptCount.toString());
    clarity.setTag('question_type', questionType);
  },

  answerRetried: () => {
    if (!isClarityEnabled()) return;
    clarity.event('answer_retried');
  },

  // User progress tracking
  updateUserProgress: (level: number, fruitType: string, accuracyRate: number) => {
    if (!isClarityEnabled()) return;
    clarity.setTag('user_level', level.toString());
    clarity.setTag('fruit_type', fruitType);
    clarity.setTag('overall_accuracy', `${accuracyRate}%`);
  },

  // Feature usage tracking
  reviewNotesOpened: (hashtag?: string) => {
    if (!isClarityEnabled()) return;
    clarity.event('review_notes_opened');
    if (hashtag) {
      clarity.setTag('review_notes_filter', hashtag);
    }
  },

  vocabularyAdded: () => {
    if (!isClarityEnabled()) return;
    clarity.event('vocabulary_added');
  },

  vocabularyRemoved: () => {
    if (!isClarityEnabled()) return;
    clarity.event('vocabulary_removed');
  },

  learningStatusViewed: () => {
    if (!isClarityEnabled()) return;
    clarity.event('learning_status_viewed');
  },

  audioPlayed: (audioType: 'normal' | 'slow') => {
    if (!isClarityEnabled()) return;
    clarity.event('audio_played');
    clarity.setTag('audio_speed', audioType);
  },

  // Navigation tracking
  pageViewed: (pageName: string) => {
    if (!isClarityEnabled()) return;
    clarity.event(`page_viewed_${pageName}`);
  },

  // Error tracking
  errorOccurred: (errorType: string, errorMessage: string) => {
    if (!isClarityEnabled()) return;
    clarity.event('error_occurred');
    clarity.setTag('error_type', errorType);
    clarity.setTag('error_message', errorMessage);
  },
};

/**
 * Hook to track page views automatically
 */
export const useClarityPageTracking = (pageName: string) => {
  useEffect(() => {
    ClarityTracker.pageViewed(pageName);
  }, [pageName]);
};

/**
 * Hook to identify user when they log in
 */
export const useClarityUserTracking = (userId: number | string | null) => {
  useEffect(() => {
    if (userId) {
      ClarityTracker.identifyUser(userId);
    }
  }, [userId]);
};

export default ClarityTracker;
