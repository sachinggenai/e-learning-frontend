/**
 * Preview Component
 * Course preview player for testing course content as specified in Phase 1
 */

import React, { useEffect, useState } from "react";
import { normalizeTemplateType } from "../constants/templateTypes";
import { useCourse } from "../context/CourseContext";
import { PlayerState, Template } from "../types/course";
import "./Preview.css";

interface PreviewProps {
  // No props needed as state comes from context
}

const Preview: React.FC<PreviewProps> = () => {
  const { course } = useCourse();
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentSlide: 0,
    completed: new Array(course.templates.length).fill(false),
    timeSpent: 0,
  });

  // Timer for tracking time spent
  useEffect(() => {
    const timer = setInterval(() => {
      setPlayerState((prev) => ({
        ...prev,
        timeSpent: prev.timeSpent + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mark current slide as viewed
  useEffect(() => {
    setPlayerState((prev) => {
      const newCompleted = [...prev.completed];
      newCompleted[prev.currentSlide] = true;
      return { ...prev, completed: newCompleted };
    });
  }, [playerState.currentSlide]);

  const currentTemplate = course.templates[playerState.currentSlide];
  const progress =
    ((playerState.currentSlide + 1) / course.templates.length) * 100;
  const isLastSlide = playerState.currentSlide === course.templates.length - 1;
  const isFirstSlide = playerState.currentSlide === 0;

  const handleNext = () => {
    if (!isLastSlide) {
      setPlayerState((prev) => ({
        ...prev,
        currentSlide: prev.currentSlide + 1,
      }));
    }
  };

  const handlePrevious = () => {
    if (!isFirstSlide) {
      setPlayerState((prev) => ({
        ...prev,
        currentSlide: prev.currentSlide - 1,
      }));
    }
  };

  const handleSlideNavigation = (slideIndex: number) => {
    if (course.navigation.lockProgression) {
      // Only allow navigation to completed slides or next slide
      const canNavigateTo =
        playerState.completed[slideIndex] ||
        slideIndex === playerState.currentSlide + 1 ||
        slideIndex === playerState.currentSlide;

      if (canNavigateTo) {
        setPlayerState((prev) => ({
          ...prev,
          currentSlide: slideIndex,
        }));
      }
    } else {
      // Free navigation
      setPlayerState((prev) => ({
        ...prev,
        currentSlide: slideIndex,
      }));
    }
  };

  const handleFinish = () => {
    alert("Course completed! Well done.");
    console.log("Course completion stats:", {
      totalSlides: course.templates.length,
      timeSpent: playerState.timeSpent,
      completedSlides: playerState.completed.filter(Boolean).length,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentTemplate) {
    return (
      <div className="preview-container">
        <div className="preview-error">
          <h2>No Content Available</h2>
          <p>Please create templates in the editor to preview content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-container">
      {/* Header with progress */}
      <header className="preview-header">
        <div className="course-info">
          <h1 className="course-title">{course.title}</h1>
          <p className="course-author">by {course.author}</p>
        </div>

        {course.navigation.showProgress && (
          <div className="progress-section">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {playerState.currentSlide + 1} of {course.templates.length}
            </div>
          </div>
        )}

        <div className="session-info">
          <span className="time-spent">
            ⏱️ {formatTime(playerState.timeSpent)}
          </span>
        </div>
      </header>

      {/* Side navigation */}
      <aside className="slide-navigation">
        <h3>Course Navigation</h3>
        <ul className="slide-list">
          {course.templates.map((template, index) => (
            <li key={template.id} className="slide-item">
              <button
                className={`slide-nav-btn ${
                  index === playerState.currentSlide ? "active" : ""
                } ${playerState.completed[index] ? "completed" : ""} ${
                  course.navigation.lockProgression &&
                  !playerState.completed[index] &&
                  index !== playerState.currentSlide &&
                  index !== playerState.currentSlide + 1
                    ? "locked"
                    : ""
                }`}
                onClick={() => handleSlideNavigation(index)}
                disabled={
                  course.navigation.lockProgression &&
                  !playerState.completed[index] &&
                  index !== playerState.currentSlide &&
                  index !== playerState.currentSlide + 1
                }
              >
                <span className="slide-number">{index + 1}</span>
                <span className="slide-title">{template.title}</span>
                <span className="slide-status">
                  {playerState.completed[index]
                    ? "✓"
                    : index === playerState.currentSlide
                      ? "▶️"
                      : "○"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content area */}
      <main className="preview-content">
        <div className="slide-container">{renderTemplate(currentTemplate)}</div>

        {/* Controls */}
        <footer className="preview-controls">
          <button
            className="control-btn prev-btn"
            onClick={handlePrevious}
            disabled={
              isFirstSlide ||
              (course.navigation.lockProgression &&
                !course.navigation.allowSkip)
            }
          >
            ← Previous
          </button>

          <div className="slide-info">
            <span className="slide-counter">
              Slide {playerState.currentSlide + 1} of {course.templates.length}
            </span>
            <span className="slide-type">{currentTemplate.type}</span>
          </div>

          {isLastSlide ? (
            <button className="control-btn finish-btn" onClick={handleFinish}>
              🏁 Finish Course
            </button>
          ) : (
            <button className="control-btn next-btn" onClick={handleNext}>
              Next →
            </button>
          )}
        </footer>
      </main>
    </div>
  );
};

// Template rendering functions
const renderTemplate = (template: Template) => {
  const t = normalizeTemplateType(template.type);
  switch (t) {
    case "welcome":
      return renderWelcomeTemplate(template);
    case "content-text":
      return renderContentTextTemplate(template);
    case "content-video":
      return renderContentVideoTemplate(template);
    case "mcq":
      return <MCQTemplate template={template} />;
    case "summary":
      return renderSummaryTemplate(template);
    default:
      return (
        <div className="template-error">
          <h2>Unknown Template Type</h2>
          <p>
            Template type "{template.type}" is not supported (normalized: {t}).
          </p>
        </div>
      );
  }
};

const renderWelcomeTemplate = (template: Template) => {
  const data = template.data as any;
  return (
    <div className="template welcome-template">
      <div className="welcome-content">
        <h1 className="welcome-title">{data.title}</h1>
        <h2 className="welcome-subtitle">{data.subtitle}</h2>
        <p className="welcome-description">{data.description}</p>
      </div>
    </div>
  );
};

const renderContentTextTemplate = (template: Template) => {
  const data = template.data as any;
  return (
    <div className="template content-template">
      <h2 className="content-title">{data.title}</h2>
      <div className="content-body">
        {data.body.split("\n").map((paragraph: string, index: number) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

const renderContentVideoTemplate = (template: Template) => {
  const data = template.data as any;
  return (
    <div className="template video-template">
      <h2 className="content-title">{data.title}</h2>

      <div className="video-container">
        {data.videoUrl ? (
          <video
            controls
            style={{ width: "100%", maxWidth: "640px", height: "auto" }}
            preload="metadata"
          >
            <source src={data.videoUrl} type="video/mp4" />
            <p>
              Your browser doesn't support HTML video. Here is a
              <a href={data.videoUrl}>link to the video</a> instead.
            </p>
          </video>
        ) : (
          <div className="video-placeholder">
            <div className="placeholder-icon">🎥</div>
            <p>Video content will be displayed here</p>
            <small>No video URL provided</small>
          </div>
        )}
      </div>

      {data.body && (
        <div className="content-body">
          {data.body.split("\n").map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
};

const MCQTemplate: React.FC<{ template: Template }> = ({ template }) => {
  const data = template.data as any;
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowFeedback(false);
    setFeedback("");
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) {
      setFeedback("Please select an answer before submitting.");
      setShowFeedback(true);
      return;
    }

    const selectedOpt = data.options.find(
      (opt: any) => opt.id === selectedOption,
    );
    if (selectedOpt?.isCorrect) {
      setFeedback("Correct! Well done.");
    } else {
      const correctOpt = data.options.find((opt: any) => opt.isCorrect);
      setFeedback(`Incorrect. The correct answer is: "${correctOpt?.text}"`);
    }
    setShowFeedback(true);
  };

  return (
    <div className="template mcq-template">
      <h2 className="mcq-question">{data.question}</h2>

      <div className="mcq-options">
        {data.options.map((option: any) => (
          <label
            key={option.id}
            className={`mcq-option ${selectedOption === option.id ? "selected" : ""}`}
          >
            <input
              type="radio"
              name="mcq-answer"
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => handleOptionSelect(option.id)}
            />
            <span className="option-text">{option.text}</span>
          </label>
        ))}
      </div>

      <button
        className="submit-answer-btn"
        onClick={handleSubmitAnswer}
        disabled={!selectedOption}
      >
        Submit Answer
      </button>

      {showFeedback && (
        <div
          className={`mcq-feedback ${feedback.includes("Correct") ? "correct" : "incorrect"}`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
};

const renderSummaryTemplate = (template: Template) => {
  const data = template.data as any;
  return (
    <div className="template summary-template">
      <h2 className="summary-title">{data.title}</h2>

      <div className="key-points">
        <h3>Key Learning Points:</h3>
        <ul className="points-list">
          {data.keyPoints.map((point: string, index: number) => (
            <li key={index} className="point-item">
              <span className="point-number">{index + 1}</span>
              <span className="point-text">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Preview;
