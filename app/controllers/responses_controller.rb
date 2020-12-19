class ResponsesController < ApplicationController
  protect_from_forgery with: :null_session
  def new
    if request.format.html?
      render 'new'
    else
      render json: survey_json(Question.all, Response.new, false)
    end
  end

  def create
    response = Response.new(response_params)
    if response.valid?
      response.save
      render json: {res: 'ok'}
    else
      render json: survey_json(Question.all, response, true)
    end
  end

  protected


  def survey_json(questions, response, with_errors)
    questions.map do |question|
      if question.answertype == 'checkbox'
        {
          id: question.id,
          answertype: question.answertype,
          options: question.options.map {|o| 
            {id: o.id, name: o.name, checked: answer_for(response, question, o)}
          },
          name: question.name,
          errors: errors_for(response, question, with_errors),
          key: question.to_s
        }
      elsif question.answertype == 'text_field'
        {
          id: question.id,
          answertype: question.answertype,
          text_field: answer_for(response, question, nil),
          name: question.name,
          errors: errors_for(response, question, with_errors),
          key: question.to_s
        }
      else
        {
          id: question.id,
          answertype: question.answertype,
          textarea: answer_for(response, question, nil),
          name: question.name,
          errors: errors_for(response, question, with_errors),
          key: question.to_s
        }
      end
    end
  end

  def answer_for(response, question, option)
    if question.answertype == 'checkbox'
      answer = answer_object(response, question)
      if answer.present?
        answer.choices.map(&:option_id).include?(option.id)
      end
    elsif question.answertype == 'text_field'
      answer_object(response, question).try(:text_field) || ''
    elsif question.answertype == 'textarea'
      answer_object(response, question).try(:textarea) || ''
    end
  end

  def answer_object(response, question)
    response.answers.find{|answer| question.id == answer.question_id}
  end

  def errors_for(response, question, with_errors)
    unless with_errors
      return []
    end
    answer = response.answers.find{|answer| question.id == answer.question_id}
    return answer.errors.full_messages.join(', ')
  end

  def response_params
    params.require(:response).permit(answers_attributes:[:question_id, :textarea, :text_field, choices_attributes:[:option_id]])
  end
end