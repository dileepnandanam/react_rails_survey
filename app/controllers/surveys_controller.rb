class SurveysController < ApplicationController
  protect_from_forgery with: :null_session
  def show
    if request.format.html?
      render 'show'
    else
      render json: survey_json(Question.all)
    end
  end

  protected


  def survey_json(questions, response)
    questions.map do |question|
      if question.answertype == 'checkbox'
        {
          id: question.id,
          answertype: question.answertype,
          options: question.options.map {|o| {id: o.id, name: o.name, checked: false}},
          name: question.name
        }
      else
        {
          id: question.id,
          answertype: question.answertype,
          text_field: '',
          textarea: '',
          name: question.name
        }
      end
    end
  end
end