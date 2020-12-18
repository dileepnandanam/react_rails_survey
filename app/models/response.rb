class Response < ApplicationRecord
  has_many :answers
  accepts_nested_attributes_for :answers
  validates_associated :answers
end
