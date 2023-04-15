import plus from '../assets/images/button.png'
import { useNavigate } from 'react-router-dom';


export default function Plus() {
	const navigate = useNavigate();
	const navigateToCreatePoll = () => {
		navigate('/create-poll');
	};
	return (
		<div className="fixed right-5 bottom-5 ">
			<img src={plus} width={50} height={50} className='cursor-pointer' onClick={navigateToCreatePoll} />
		</div>

	);
}