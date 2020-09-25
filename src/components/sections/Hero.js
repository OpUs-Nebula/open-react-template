import React, { useState } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import Image from '../elements/Image';
import Modal from '../elements/Modal';

const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}

const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}) => {

  const [videoModalActive, setVideomodalactive] = useState(false);

  const openModal = (e) => {
    e.preventDefault();
    setVideomodalactive(true);
  }

  const closeModal = (e) => {
    e.preventDefault();
    setVideomodalactive(false);
  } 

  const screenState = {
    textbox:""
  }
  
  const handleChange = (event) => {
    screenState.textbox=event.target.value;
  }

  const validateInput = (text) => {
    return text
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    validateInput(screenState.textbox)
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain'},
        body: JSON.stringify(screenState.textbox)
    };
    const response = await fetch('https://el5j0gd504.execute-api.us-east-1.amazonaws.com/DemoInferenceService', requestOptions);
    const data = await response.json();
    alert(data.results);
  }

  const outerClasses = classNames(
    'hero section center-content',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container-sm">
        <div className={innerClasses}>
          <div className="hero-content">
            <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
              CONJECT
            </h1>
          </div>
          <div className="hero-figure reveal-from-bottom illustration-element-01" data-reveal-value="20px" data-reveal-delay="800">
          </div>
          <form onSubmit={handleSubmit} id="form1">
            <textarea value={screenState.textarea} rows={20} cols={40} onChange={handleChange}/>
          </form>
        </div>
         <div className="mb-32 reveal-from-bottom" data-reveal-delay="600">
                <ButtonGroup>
                  <Button type="submit" form="form1" value="Submit" color="primary" wideMobile>
                    SUMMARIZE
                    </Button>
                </ButtonGroup>
        </div>
      </div>
    </section>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;