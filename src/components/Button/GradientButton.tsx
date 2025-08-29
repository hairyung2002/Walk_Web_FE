import './GradientButton.css';

interface GradientButtonProps {
  buttonType: 'textButton' | 'imgButton';
  text: string;
  onClick: () => void;
  type?: 'button' | 'submit';
}

const GradientButton = ({ buttonType, text, onClick, type = 'button' }: GradientButtonProps) => {
  const typeClass = buttonType === 'textButton' ? 'gradient-button-text' : 'gradient-button-img';

  return (
    <button type={type} onClick={onClick} className={`gradient-button ${typeClass}`}>
      {text}
    </button>
  );
};

export default GradientButton;
