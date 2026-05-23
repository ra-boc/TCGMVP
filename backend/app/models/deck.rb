class Deck < ApplicationRecord
  belongs_to :user
  has_many :matches, dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :user_id }
  validates :archetype, length: { maximum: 100 }
  validates :notes, length: { maximum: 2_000 }
end
