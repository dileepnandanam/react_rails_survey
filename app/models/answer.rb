class FieldPresenceValidator < ActiveModel::Validator
  def validate(record)
    if record.question.answertype == 'textarea'
      if record.textarea.blank?
        record.errors[:base] << 'can\'t be blank'
      end
    elsif record.question.answertype == 'text_field'
      record.errors[:base] << 'can\'t be blank' if record.text_field.blank?
    else
      record.errors[:base] << 'choose atleast one' if record.choices.length == 0
    end
  end
end

class Answer < ApplicationRecord
  has_many :choices
  belongs_to :question
  accepts_nested_attributes_for :choices
  
  validates_with FieldPresenceValidator
end
