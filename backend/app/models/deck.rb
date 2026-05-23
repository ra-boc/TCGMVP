class Deck < ApplicationRecord
  belongs_to :user
  has_many :matches, dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :user_id }
  validates :archetype, length: { maximum: 100 }
  validates :notes, length: { maximum: 2_000 }
  validates :deck_code, length: { maximum: 20 }, allow_blank: true
  validates :deck_url, length: { maximum: 2_000 }, allow_blank: true
  validates :deck_list, length: { maximum: 10_000 }, allow_blank: true
end
