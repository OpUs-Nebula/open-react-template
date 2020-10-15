import React, { useState } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import Image from '../elements/Image';
import Modal from '../elements/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';

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

  const validateOutput = (response) => {
    return !(response == null || response.trim() === "")
  }
  
  const paragraphMerging = (word_list) => {
    const paragraph_size = 200; //Average size of paragraphs according to google
    var i;
    var paragraph_list = [];
    for (i=0; i<word_list.length; i+=paragraph_size) {
      paragraph_list.push(word_list.slice(i,i+paragraph_size).join(" "));
    } 
    return paragraph_list;
  }

  const [showProgress,setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeToFin, setTimeToFin] = useState(0);

  const SummaryProgress = () => {
    return <ProgressBar animated now={progress} />;
  }


  /*
   Current flaws:
   - Split method does not take into account newlines; Can cause large paragraphs to form.
   - No notification on processing occuring.(Loading bar)
   - Failure notification assumes that more than 1 paragraph is present.(or else req_list.length=out_list.length)

  */
  const handleSubmit = async (event) => {
    event.preventDefault();
    validateInput(screenState.textbox);
    const word_list = screenState.textbox.split(" ");
    const req_list = paragraphMerging(word_list);
    console.log(req_list)
    var out_list = [];
    var result = "arbitrary";
    var i;
    setTimeToFin(req_list.length*0.20)
    setShowProgress(true)
    for (i=0; i < req_list.length && validateOutput(result); i++) {
      const paragraph = req_list[i];
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain'},
        body: paragraph
      };
      const response = await fetch('https://el5j0gd504.execute-api.us-east-1.amazonaws.com/DemoInferenceService', requestOptions);
      const data = await response.json();
      result = data.results;
      console.log(typeof(result));
      out_list.push(result);
      setProgress(((i+1)/req_list.length)*100);
    }
    var filtered_out = out_list.filter(function (el) {
      return el != null;
    });
    if (req_list.length === filtered_out.length) {
      alert(filtered_out.join(" "))
    } else {
      alert("Something about the text is confusing the summarizer. It can only understand chunks of text 512 words long, containing at least 3 sentences. If it contains more words than that, then put 3 or more spaces between each chunk.")
    }
    setShowProgress(false);
    setTimeToFin(0);
    setProgress(0);
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
          { showProgress ? <div>Duration: ~{timeToFin} minutes<SummaryProgress /></div> : null }
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