import { useState, useEffect, useRef } from 'react';
import { Button, Card, Container, Navbar, Nav, Row, Col } from 'react-bootstrap';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

function Home() {
  const [theme, setTheme] = useState('light');
  const [hoveredCard, setHoveredCard] = useState(null);
  // Stores the previous scroll position to calculate real-time movement direction
  const lastScrollY = useRef(0);

  // Track screen width window sizes dynamically
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isScrolled, setIsScrolled] = useState(false);
  // Tracks if the user has completed the initial automated transition
  const [hasAutoScrolled, setHasAutoScrolled] = useState(false);


  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    const handleScrollPrompt = () => {
      const currentScrollY = window.scrollY;
      const bannerHeight = window.innerHeight;
      
      // Determine the scroll direction: true if moving upward, false if moving downward
      const isScrollingUp = currentScrollY < lastScrollY.current;

      // 1. Existing prompt visibility calculations
      if (currentScrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. DOWNWARD AUTOMATED SNAP (Pass the banner)
      if (currentScrollY > 15 && currentScrollY < bannerHeight && !hasAutoScrolled && !isScrollingUp) {
        setHasAutoScrolled(true);
        window.scrollTo({
          top: bannerHeight,
          behavior: 'smooth'
        });
      }

      // 3. UPWARD AUTOMATED SNAP (Return to the very top banner screen)
      // Triggers if scrolling up and the viewport passes inside the bottom threshold of the banner
      if (isScrollingUp && currentScrollY < (bannerHeight - 20) && currentScrollY > 0 && hasAutoScrolled) {
        setHasAutoScrolled(false);
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }

      // Safety fallback reset if the user manually jumps to the absolute top anchor position
      if (currentScrollY === 0) {
        setHasAutoScrolled(false);
      }

      // Save the current position as the benchmark for the next calculated movement
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScrollPrompt);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScrollPrompt);
    };
  }, [hasAutoScrolled]); // Monitored lock dependency tracks toggle conditions reliably




  // Set categorical layout flags based on target breakpoint boundaries
  const isDesktop = windowWidth >= 992;
  const isTablet = windowWidth >= 576 && windowWidth < 992;
  const isPhone = windowWidth < 576;

  // Framer Motion scroll tracker (0 at top, 1 at bottom of page)
  const { scrollYProgress } = useScroll();
  // Progresses smoothly from an opacity of 0.5 down to 0 as the page is scrolled
  const scrollPromptOpacity = useTransform(scrollYProgress, [0, 0.05], [0.5, 0]);

  // Completely disables pointer clicks and hides the element from layout tracking after 5% scroll
  const scrollPromptVisibility = useTransform(scrollYProgress, [0, 0.05], ["auto", "none"]);

  // Unified scroll animations for devices and lightning elements
  const devicesScale = useTransform(scrollYProgress, [0, 0.4, 0.8], [1, 0.85, 0.7]);
  const devicesY = useTransform(scrollYProgress, [0, 0.4, 1], [0, -50, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-dark' : 'bg-light';
  const textColor = isDark ? 'text-white' : 'text-dark';
  const btnVariant = isDark ? 'outline-light' : 'outline-dark';
  const cardBg = isDark ? 'dark' : 'light';

  const projects = [
    { id: 1, title: 'E-Commerce Site', text: 'A fully responsive digital storefront with secure state-managed checkout logic.' },
    { id: 2, title: 'Task Dashboard', text: 'An analytical dashboard built with real-time charting utilities and drag-and-drop lists.' },
    { id: 3, title: 'Weather Application', text: 'A sleek search interface that fetches and structures data from weather endpoints.' }
  ];

  return (
    <motion.div 
      className={`${bgColor} ${textColor} min-vh-100`} 
      animate={{ backgroundColor: isDark ? '#212529' : '#f8f9fa' }}
      transition={{ duration: 0.4 }}
      style={{ overflowX: 'hidden' }}
    >
      
      {/* 1. HERO BANNER LANDING SCREEN */}
      <motion.div 
        style={{ 
          position: 'relative',
          overflow: 'hidden',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: isDark
            ? 'radial-gradient(circle at center, rgba(138, 43, 226, 0.15) 0%, rgba(33, 37, 41, 0) 70%)'
            : 'radial-gradient(circle at center, rgba(0, 114, 255, 0.12) 0%, rgba(248, 249, 250, 0) 70%)',
          boxShadow: isDark
            ? '0 0 40px rgba(138, 43, 226, 0.4), 0 0 100px rgba(138, 43, 226, 0.2), inset 0 0 20px rgba(138, 43, 226, 0.3)'
            : '0 0 40px rgba(0, 114, 255, 0.3), 0 0 100px rgba(0, 114, 255, 0.15), inset 0 0 20px rgba(0, 114, 255, 0.2)',
        }}
      >

        {/* Navigation Bar */}
        <Navbar 
          bg="transparent" 
          variant={theme} 
          expand="lg" 
          className="px-4 position-absolute top-0 start-0 w-100" 
          style={{ zIndex: 10, height: '80px' }}
        >
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Nav className="me-3">
                <Nav.Link href="#about" className="fw-medium">About</Nav.Link>
                <Nav.Link href="#projects" className="fw-medium">Projects</Nav.Link>
              </Nav>
              <Button variant={btnVariant} onClick={toggleTheme}>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* WORKSTATION ANIMATED ACCENTS WRAPPER */}
        <motion.div 
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 5,
            scale: devicesScale,
            y: devicesY,
            width: '100%',
            maxWidth: '900px',
            padding: '0 20px'
          }}
        >
          
          {/* A. DESKTOP VIEWPORT ONLY: VECTOR LAPTOP */}
          {isDesktop && (
            <div style={{ position: 'relative', width: '480px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <motion.div 
                style={{
                  width: '420px',
                  height: '260px',
                  borderRadius: '16px 16px 0 0',
                  border: isDark ? '4px solid #495057' : '4px solid #212529',
                  boxShadow: isDark ? '0 15px 30px rgba(0,0,0,0.5)' : '0 15px 30px rgba(0,0,0,0.1)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                animate={{ backgroundColor: isDark ? '#1a1d20' : '#ffffff' }}
              >
                <motion.div className="text-center px-3" style={{ opacity: contentOpacity }}>
                  <h2 className="fs-4 fw-bold mb-1">Web Portfolio</h2>
                  <p className="small opacity-75 mb-0">Desktop Workstation Frame</p>
                </motion.div>
              </motion.div>
              <div style={{ position: 'absolute', top: '8px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#495057' }} />
              <motion.div 
                style={{
                  width: '480px',
                  height: '14px',
                  borderRadius: '0 0 12px 12px',
                  border: isDark ? '4px solid #495057' : '4px solid #212529',
                  position: 'relative'
                }}
                animate={{ backgroundColor: isDark ? '#343a40' : '#dee2e6' }}
              >
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '70px', height: '5px', borderRadius: '0 0 4px 4px', backgroundColor: isDark ? '#212529' : '#adb5bd' }} />
              </motion.div>
            </div>
          )}

          {/* B. TABLET VIEWPORT ONLY: VECTOR TABLET */}
          {isTablet && (
            <motion.div 
              style={{
                position: 'relative',
                width: '340px',
                height: '460px',
                borderRadius: '28px',
                border: isDark ? '5px solid #495057' : '5px solid #212529',
                boxShadow: isDark ? '0 20px 45px rgba(0,0,0,0.5)' : '0 20px 45px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
              }}
              animate={{ backgroundColor: isDark ? '#1a1d20' : '#ffffff' }}
            >
              <div style={{ position: 'absolute', top: '12px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#495057' }} />
              <motion.div className="text-center px-3" style={{ opacity: contentOpacity }}>
                <h2 className="fs-3 fw-bold mb-1">Web Portfolio</h2>
                <p className="small opacity-75 mb-0">Tablet Layout Frame</p>
              </motion.div>
            </motion.div>
          )}

          {/* C. SMARTPHONE VIEWPORT ONLY: STATIONARY PHONE */}
          {isPhone && (
            <motion.div 
              style={{
                position: 'relative',
                width: '180px',
                height: '340px',
                borderRadius: '28px',
                border: isDark ? '4px solid #495057' : '4px solid #212529',
                boxShadow: isDark ? '0 15px 35px rgba(0,0,0,0.5)' : '0 15px 35px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px'
              }}
              animate={{ backgroundColor: isDark ? '#1a1d20' : '#ffffff', borderColor: isDark ? '#495057' : '#212529' }}
            >
              <div style={{ position: 'absolute', top: '8px', width: '40px', height: '10px', borderRadius: '5px', backgroundColor: isDark ? '#495057' : '#212529' }} />
              <motion.div className="text-center" style={{ opacity: contentOpacity }}>
                <h3 className="fs-5 fw-bold mb-0">Mobile UI</h3>
                <span style={{ fontSize: '11px' }} className="opacity-75">Phone Grid Frame</span>
              </motion.div>
            </motion.div>
          )}

        </motion.div>

        {/* Animated scroll down prompt that totally hides upon scrolling */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            bottom: '25px', 
            zIndex: 1,
            opacity: scrollPromptOpacity,
            // Forces display: 'none' once page scrolling is detected
            display: isScrolled ? 'none' : 'block',
            pointerEvents: isScrolled ? 'none' : 'auto'
          }} 
          animate={{ y: [0, -8, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: "easeInOut" 
          }}
        >
          <span className="fs-6 fw-light d-block text-center">Scroll down to explore</span>
        </motion.div>

      </motion.div>

           {/* 2. FEATURED PROJECTS TARGET REPOSITORY GRID */}
      <Container id="projects" className="py-5" style={{ minHeight: '100vh', paddingTop: '120px' }}>
        
        {/* Scroll Reveal Title Container Block */}
        <motion.div 
          className="text-center position-relative py-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-2 fw-bold display-5">Featured Projects</h2>
          <p className="opacity-75">Illuminated beneath the dynamic desk workspace layout</p>
        </motion.div> {/* <--- THIS CLOSING TAG FIXES THE BABEL COMPILE ERROR */}
        
        <Row className="g-4 justify-content-center">
          {projects.map((project, idx) => (
            <Col key={project.id} md={4} sm={6} className="d-flex justify-content-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onMouseEnter={() => setHoveredCard(project.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ width: '18rem' }}
              >
                <Card 
                  bg={cardBg} 
                  text={textColor} 
                  className="shadow-sm w-100 h-100"
                  style={{
                    transition: 'background-color 0.4s ease, color 0.4s ease, box-shadow 0.3s ease',
                    boxShadow: hoveredCard === project.id 
                      ? (isDark ? '0 0 30px rgba(138, 43, 226, 0.25)' : '0 0 30px rgba(0, 114, 255, 0.2)') 
                      : '0 4px 6px rgba(0,0,0,0.05)',
                  }}
                >
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <Card.Title 
                        className="fw-bold"
                        style={{
                          color: isDark ? '#ffffff' : '#005ed6',
                          textShadow: isDark ? '0 0 10px rgba(138, 43, 226, 0.5)' : 'none',
                          transition: 'color 0.4s ease, text-shadow 0.4s ease'
                        }}
                      >
                        {project.title}
                      </Card.Title>
                      <Card.Text 
                        style={{
                          color: isDark ? '#e2e8f0' : '#1e293b',
                          opacity: isDark ? 0.85 : 0.9,
                          transition: 'color 0.4s ease'
                        }}
                      >
                        {project.text}
                      </Card.Text>
                    </div>
                    <Button 
                      size="sm" 
                      className="mt-3 align-self-start fw-medium"
                      style={{
                        backgroundColor: isDark ? '#8a2be2' : '#0072ff',
                        borderColor: isDark ? '#8a2be2' : '#0072ff',
                        color: '#ffffff',
                        transition: 'all 0.3s ease',
                        boxShadow: isDark ? '0 0 10px rgba(138, 43, 226, 0.4)' : '0 0 10px rgba(0, 114, 255, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDark ? '#701fa2' : '#005ed6';
                        e.currentTarget.style.borderColor = isDark ? '#701fa2' : '#005ed6';
                        e.currentTarget.style.boxShadow = isDark ? '0 0 20px rgba(138, 43, 226, 0.7)' : '0 0 20px rgba(0, 114, 255, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isDark ? '#8a2be2' : '#0072ff';
                        e.currentTarget.style.borderColor = isDark ? '#8a2be2' : '#0072ff';
                        e.currentTarget.style.boxShadow = isDark ? '0 0 10px rgba(138, 43, 226, 0.4)' : '0 0 10px rgba(0, 114, 255, 0.3)';
                      }}
                    >
                      View Repository
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </motion.div>
  );
}

export default Home;

