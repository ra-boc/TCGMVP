class User < ApplicationRecord
  has_many :decks, dependent: :destroy
  has_many :matches, dependent: :destroy

  validates :name, presence: true
end
