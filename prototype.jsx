import React, { useState, useRef } from 'react';

const dreams = [
  { id: 'fitness', icon: '💪', title: 'Health & Vitality', desc: 'Your strongest, most energetic self' },
  { id: 'career', icon: '✨', title: 'Career Success', desc: 'Confidence in your professional life' },
  { id: 'home', icon: '🏡', title: 'Dream Home', desc: 'Your perfect sanctuary' },
  { id: 'travel', icon: '✈️', title: 'Adventure', desc: 'Exploring the world freely' },
  { id: 'style', icon: '🌟', title: 'Style & Confidence', desc: 'Looking and feeling your best' },
  { id: 'wealth', icon: '🍃', title: 'Abundance', desc: 'Financial peace and freedom' },
];

const affirmations = [
  "I am becoming the person I'm meant to be",
  "Every day, I move closer to my dreams",
  "I deserve all the good things coming my way",
  "My potential is limitless",
];

export default function Manifestr() {
  const [step, setStep] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedDreams, setSelectedDreams] = useState([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDream = (id) => {
    setSelectedDreams(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleReveal = () => {
    setIsRevealing(true);
    setTimeout(() => {
      setStep(3);
      setIsRevealing(false);
    }, 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FDF8F3 0%, #FEF3E8 50%, #FDF0E6 100%)',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'fixed',
        top: '-20%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255,200,150,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-30%',
        left: '-15%',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(255,180,120,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Step 0: Welcome */}
      {step === 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '40px 20px',
          animation: 'fadeIn 1s ease-out',
        }}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500&display=swap');
            @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
            @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
            @keyframes glow { 0%, 100% { box-shadow: 0 0 30px rgba(212,165,116,0.3); } 50% { box-shadow: 0 0 50px rgba(212,165,116,0.5); } }
          `}</style>
          
          <div style={{
            fontSize: '14px',
            letterSpacing: '4px',
            color: '#B89B7A',
            marginBottom: '20px',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '400',
            textTransform: 'uppercase',
          }}>
            Welcome to
          </div>
          
          <h1 style={{
            fontSize: 'clamp(48px, 12vw, 96px)',
            fontWeight: '300',
            color: '#3D3225',
            margin: '0 0 24px 0',
            letterSpacing: '-2px',
            textAlign: 'center',
          }}>
            Manifestr
          </h1>
          
          <p style={{
            fontSize: '20px',
            color: '#7A6B5A',
            maxWidth: '480px',
            textAlign: 'center',
            lineHeight: '1.8',
            marginBottom: '60px',
            fontWeight: '300',
          }}>
            See your future self. Believe in your potential.<br/>
            <span style={{ fontStyle: 'italic', color: '#B89B7A' }}>Manifest your dreams.</span>
          </p>

          <button
            onClick={() => setStep(1)}
            style={{
              background: 'linear-gradient(135deg, #D4A574 0%, #C4956A 100%)',
              color: '#FFF',
              border: 'none',
              padding: '20px 60px',
              fontSize: '16px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '400',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 10px 40px rgba(212,165,116,0.4)',
              transition: 'all 0.4s ease',
              animation: 'glow 3s ease-in-out infinite',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 15px 50px rgba(212,165,116,0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 40px rgba(212,165,116,0.4)';
            }}
          >
            Begin Your Journey
          </button>

          <div style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            gap: '8px',
          }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width: i === 0 ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === 0 ? '#D4A574' : 'rgba(212,165,116,0.3)',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Upload Photo */}
      {step === 1 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '40px 20px',
          animation: 'fadeIn 0.6s ease-out',
        }}>
          <div style={{
            fontSize: '12px',
            letterSpacing: '3px',
            color: '#B89B7A',
            marginBottom: '16px',
            fontFamily: "'Outfit', sans-serif",
            textTransform: 'uppercase',
          }}>
            Step 1 of 3
          </div>
          
          <h2 style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: '300',
            color: '#3D3225',
            margin: '0 0 16px 0',
            textAlign: 'center',
          }}>
            Show Us You
          </h2>
          
          <p style={{
            fontSize: '18px',
            color: '#7A6B5A',
            marginBottom: '48px',
            fontWeight: '300',
            textAlign: 'center',
          }}>
            Upload a photo to begin visualizing your future self
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '280px',
              height: '340px',
              borderRadius: '200px 200px 140px 140px',
              border: uploadedImage ? 'none' : '2px dashed #D4A574',
              background: uploadedImage 
                ? `url(${uploadedImage}) center/cover no-repeat`
                : 'linear-gradient(180deg, rgba(212,165,116,0.08) 0%, rgba(212,165,116,0.15) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              boxShadow: uploadedImage 
                ? '0 20px 60px rgba(0,0,0,0.15)' 
                : '0 10px 40px rgba(212,165,116,0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = uploadedImage 
                ? '0 25px 70px rgba(0,0,0,0.2)' 
                : '0 15px 50px rgba(212,165,116,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = uploadedImage 
                ? '0 20px 60px rgba(0,0,0,0.15)' 
                : '0 10px 40px rgba(212,165,116,0.15)';
            }}
          >
            {!uploadedImage && (
              <>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(212,165,116,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  <span style={{ fontSize: '28px' }}>📷</span>
                </div>
                <span style={{
                  color: '#B89B7A',
                  fontSize: '16px',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: '400',
                }}>
                  Tap to upload
                </span>
              </>
            )}
            {uploadedImage && (
              <div style={{
                position: 'absolute',
                bottom: '16px',
                background: 'rgba(255,255,255,0.9)',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '13px',
                fontFamily: "'Outfit', sans-serif",
                color: '#7A6B5A',
              }}>
                Tap to change
              </div>
            )}
          </div>

          <button
            onClick={() => uploadedImage && setStep(2)}
            disabled={!uploadedImage}
            style={{
              marginTop: '48px',
              background: uploadedImage 
                ? 'linear-gradient(135deg, #D4A574 0%, #C4956A 100%)'
                : 'rgba(212,165,116,0.3)',
              color: '#FFF',
              border: 'none',
              padding: '18px 50px',
              fontSize: '14px',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '2px',
              textTransform: 'uppercase',
              borderRadius: '50px',
              cursor: uploadedImage ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: uploadedImage ? '0 8px 30px rgba(212,165,116,0.4)' : 'none',
            }}
          >
            Continue
          </button>

          <div style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            gap: '8px',
          }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width: i === 1 ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i <= 1 ? '#D4A574' : 'rgba(212,165,116,0.3)',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select Dreams */}
      {step === 2 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '60px 20px',
          animation: 'fadeIn 0.6s ease-out',
        }}>
          <div style={{
            fontSize: '12px',
            letterSpacing: '3px',
            color: '#B89B7A',
            marginBottom: '16px',
            fontFamily: "'Outfit', sans-serif",
            textTransform: 'uppercase',
          }}>
            Step 2 of 3
          </div>
          
          <h2 style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: '300',
            color: '#3D3225',
            margin: '0 0 16px 0',
            textAlign: 'center',
          }}>
            What Do You Dream Of?
          </h2>
          
          <p style={{
            fontSize: '18px',
            color: '#7A6B5A',
            marginBottom: '48px',
            fontWeight: '300',
            textAlign: 'center',
            maxWidth: '400px',
          }}>
            Select the areas of life you want to visualize for your future self
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
            maxWidth: '560px',
            width: '100%',
            marginBottom: '48px',
          }}>
            {dreams.map((dream, index) => {
              const isSelected = selectedDreams.includes(dream.id);
              return (
                <div
                  key={dream.id}
                  onClick={() => toggleDream(dream.id)}
                  style={{
                    background: isSelected 
                      ? 'linear-gradient(135deg, #D4A574 0%, #C4956A 100%)'
                      : 'rgba(255,255,255,0.7)',
                    borderRadius: '20px',
                    padding: '24px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: isSelected ? 'none' : '1px solid rgba(212,165,116,0.2)',
                    boxShadow: isSelected 
                      ? '0 10px 30px rgba(212,165,116,0.35)'
                      : '0 4px 20px rgba(0,0,0,0.04)',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(212,165,116,0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
                    }
                  }}
                >
                  <div style={{
                    fontSize: '32px',
                    marginBottom: '12px',
                    filter: isSelected ? 'grayscale(0) brightness(1.1)' : 'none',
                  }}>
                    {dream.icon}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: isSelected ? '#FFF' : '#3D3225',
                    marginBottom: '6px',
                  }}>
                    {dream.title}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontFamily: "'Outfit', sans-serif",
                    color: isSelected ? 'rgba(255,255,255,0.85)' : '#9A8B7A',
                    lineHeight: '1.5',
                  }}>
                    {dream.desc}
                  </div>
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '20px',
                      height: '20px',
                      background: 'rgba(255,255,255,0.25)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                    }}>
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleReveal}
            disabled={selectedDreams.length === 0 || isRevealing}
            style={{
              background: selectedDreams.length > 0 
                ? 'linear-gradient(135deg, #D4A574 0%, #C4956A 100%)'
                : 'rgba(212,165,116,0.3)',
              color: '#FFF',
              border: 'none',
              padding: '18px 50px',
              fontSize: '14px',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '2px',
              textTransform: 'uppercase',
              borderRadius: '50px',
              cursor: selectedDreams.length > 0 ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: selectedDreams.length > 0 ? '0 8px 30px rgba(212,165,116,0.4)' : 'none',
            }}
          >
            {isRevealing ? 'Manifesting...' : 'Reveal My Future Self'}
          </button>

          {isRevealing && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(253,248,243,0.97)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              animation: 'fadeIn 0.4s ease-out',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #D4A574 0%, #C4956A 100%)',
                animation: 'pulse 1.5s ease-in-out infinite',
                marginBottom: '32px',
              }} />
              <p style={{
                fontSize: '24px',
                color: '#3D3225',
                fontWeight: '300',
                fontStyle: 'italic',
              }}>
                {affirmations[Math.floor(Math.random() * affirmations.length)]}
              </p>
            </div>
          )}

          <div style={{
            position: 'fixed',
            bottom: '40px',
            display: 'flex',
            gap: '8px',
          }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width: i === 2 ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i <= 2 ? '#D4A574' : 'rgba(212,165,116,0.3)',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Reveal */}
      {step === 3 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '60px 20px',
          animation: 'fadeIn 0.8s ease-out',
        }}>
          <div style={{
            fontSize: '12px',
            letterSpacing: '3px',
            color: '#B89B7A',
            marginBottom: '16px',
            fontFamily: "'Outfit', sans-serif",
            textTransform: 'uppercase',
          }}>
            Your Vision
          </div>
          
          <h2 style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: '300',
            color: '#3D3225',
            margin: '0 0 40px 0',
            textAlign: 'center',
          }}>
            Meet Your Future Self
          </h2>

          <div style={{
            position: 'relative',
            marginBottom: '40px',
          }}>
            {/* Glow effect behind image */}
            <div style={{
              position: 'absolute',
              inset: '-20px',
              background: 'radial-gradient(circle, rgba(212,165,116,0.4) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(30px)',
              animation: 'pulse 3s ease-in-out infinite',
            }} />
            
            <div style={{
              width: '240px',
              height: '300px',
              borderRadius: '160px 160px 120px 120px',
              background: uploadedImage 
                ? `url(${uploadedImage}) center/cover no-repeat`
                : 'linear-gradient(135deg, #D4A574 0%, #C4956A 100%)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Golden overlay effect */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(212,165,116,0.1) 0%, rgba(255,215,150,0.15) 100%)',
                mixBlendMode: 'overlay',
              }} />
              {/* Sparkle effects */}
              <div style={{
                position: 'absolute',
                top: '20%',
                right: '15%',
                width: '8px',
                height: '8px',
                background: '#FFF',
                borderRadius: '50%',
                boxShadow: '0 0 10px 3px rgba(255,255,255,0.8)',
                animation: 'float 2s ease-in-out infinite',
              }} />
              <div style={{
                position: 'absolute',
                bottom: '30%',
                left: '10%',
                width: '6px',
                height: '6px',
                background: '#FFF',
                borderRadius: '50%',
                boxShadow: '0 0 8px 2px rgba(255,255,255,0.7)',
                animation: 'float 2.5s ease-in-out infinite 0.5s',
              }} />
            </div>
          </div>

          {/* Selected dreams badges */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '40px',
            maxWidth: '400px',
          }}>
            {selectedDreams.map(id => {
              const dream = dreams.find(d => d.id === id);
              return (
                <div key={id} style={{
                  background: 'rgba(212,165,116,0.15)',
                  padding: '10px 18px',
                  borderRadius: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#7A6B5A',
                  fontFamily: "'Outfit', sans-serif",
                }}>
                  <span>{dream.icon}</span>
                  <span>{dream.title}</span>
                </div>
              );
            })}
          </div>

          {/* Affirmation card */}
          <div style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            padding: '32px 40px',
            maxWidth: '440px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
            marginBottom: '40px',
          }}>
            <p style={{
              fontSize: '22px',
              color: '#3D3225',
              fontWeight: '400',
              fontStyle: 'italic',
              lineHeight: '1.6',
              margin: 0,
            }}>
              "This is the version of you that already exists. All you have to do is believe."
            </p>
          </div>

          <button
            onClick={() => {}}
            style={{
              background: 'linear-gradient(135deg, #D4A574 0%, #C4956A 100%)',
              color: '#FFF',
              border: 'none',
              padding: '20px 50px',
              fontSize: '14px',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '2px',
              textTransform: 'uppercase',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 10px 40px rgba(212,165,116,0.4)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 15px 50px rgba(212,165,116,0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 40px rgba(212,165,116,0.4)';
            }}
          >
            Save to My Vision Board
          </button>

          <button
            onClick={() => setStep(0)}
            style={{
              marginTop: '20px',
              background: 'transparent',
              border: 'none',
              color: '#B89B7A',
              fontSize: '14px',
              fontFamily: "'Outfit', sans-serif",
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
            }}
          >
            Start Over
          </button>

          <div style={{
            position: 'fixed',
            bottom: '40px',
            display: 'flex',
            gap: '8px',
          }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width: i === 3 ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: '#D4A574',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}