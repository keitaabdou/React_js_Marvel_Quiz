import React, {Component, Fragment} from 'react'
import Levels from '../levels';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QuizMarvel } from '../quizMarvel';
import ProgressBar from '../ProgressBar';
import QuizOver from '../QuizOver'


toast.configure();
class Quiz extends Component {

    constructor(props) {
        super(props)    

        this.initialState = {

            levelNames: ["debutant","confirme","expert"],
            quizLevel: 0,
            maxQuestions: 10,
            storeQuestions: [],
            question: null,
            options: [],
            idQuestion: 0,
            btnDisabled: true,
            userAnswer: null,
            score: 0,
            showWelcomeMsg: false,
            quizEnd: false
        }
    
        this.state = this.initialState;
        this.storeDataRef = React.createRef();
    }
    


    loadQuestions = quizz => {
        const fetchedArrayQuiz = QuizMarvel[0].quizz[quizz];
        if (fetchedArrayQuiz.length >= this.state.maxQuestions){

            this.storeDataRef.current = fetchedArrayQuiz;

          const newArray = fetchedArrayQuiz.map(({answer, ...keepRest}) => keepRest);

            this.setState({

                storeQuestions: newArray
            })

        }else{
            console.log("Pas assez de questions")
        }
    }

    showToastMsg = pseudo => {
        if(!this.state.showWelcomeMsg){

            this.setState({
                showWelcomeMsg: true
            })

            toast.warn(`Bienvenu ${pseudo}, et bonne chance!`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                });
        }
        
    }

    componentDidMount(){
        this.loadQuestions(this.state.levelNames[this.state.quizLevel])
    }

    nextQuestion = () => {
        if(this.state.idQuestion === this.state.maxQuestions -1){
            //this.gameOver();

            this.setState({
                quizEnd: true
            })
        }else{
            this.setState(prevState => ({
                idQuestion: prevState.idQuestion + 1
            })) 
        }

       const goodAnswer = this.storeDataRef.current[this.state.idQuestion].answer;
       if(this.state.userAnswer === goodAnswer){

            this.setState( prevState => ({
                score: prevState.score + 1
            }))

            toast.success('Bravo +1', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
       }else{
        toast.error('Raté 0', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
       }

    } 
    
    componentDidUpdate(prevProps, prevState){
        if((this.state.storeQuestions !== prevState.storeQuestions) && this.state.storeQuestions.length){

            this.setState({
                question: this.state.storeQuestions[this.state.idQuestion].question,
                options: this.state.storeQuestions[this.state.idQuestion].options,
            })
        }

       if((this.state.idQuestion !== prevState.idQuestion) && this.state.storeQuestions.length){
           this.setState({
                question: this.state.storeQuestions[this.state.idQuestion].question,
                options: this.state.storeQuestions[this.state.idQuestion].options,
                userAnswer: null,
                btnDisabled: true
           })
       }

       if(this.state.quizEnd !== prevState.quizEnd){

            const gradepercent = this.getPercentang(this.state.maxQuestions, this.state.score);
            this.gameOver(gradepercent);

       }

       if(this.props.userData.pseudo !== prevProps.userData.pseudo){

           this.showToastMsg(this.props.userData.pseudo)

       }
    }

    

    submitAnswer = selectedAnswer => {
        this.setState({
            userAnswer: selectedAnswer,
            btnDisabled: false
        })
    }
    
    getPercentang = (maxQuest, ourScore) => (ourScore / maxQuest) * 100;
    
    gameOver = percent => {



      if(percent >= 50){
          this.setState({
              quizLevel: this.state.quizLevel + 1,
              percent
          })

      }else{

        this.setState({
            percent
        })

      }
    }

    loadLevelQuestions = param => {
        this.setState({...this.initialState, quizLevel: param})

        this.loadQuestions(this.state.levelNames[param]);
    }

   render(){
        
       // const {pseudo} = this.props.userData;

      const displayOptions = this.state.options.map((option, index) => {

        return (

            <p key={index}
            className={`answerOptions ${this.state.userAnswer === option ? "selected" : null}`}  
            onClick={() => this.submitAnswer(option)} 
            >
            {option}
            </p>
        )
       })

      return this.state.quizEnd ? (
           <QuizOver 

               ref={this.storeDataRef}
               levelNames={this.state.levelNames}
               score={this.state.score}
               maxQuestions={this.state.maxQuestions}
               quizLevel={this.state.quizLevel}
               percent={this.state.percent}
               loadLevelQuestions={this.loadLevelQuestions}
           />
       )
       :
       (
            <Fragment>
                <Levels 

                    levelNames={this.state.levelNames}
                    quizLevel = {this.state.quizLevel}
                />
                <ProgressBar  
                    idQuestion={this.state.idQuestion}
                    maxQuestions={this.state.maxQuestions}

                />
                <h2>{this.state.question}</h2>
                {displayOptions}
                <button disabled={this.state.btnDisabled} className="btnSubmit"
                onClick={this.nextQuestion}
                >
                {this.state.idQuestion < this.state.maxQuestions - 1 ? "Suivant" : "Terminer"}
                </button>
            </Fragment>
       )

   }
}

export default Quiz
