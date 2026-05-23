class Match < ApplicationRecord
  RESULTS = %w[win loss].freeze
  TURN_ORDERS = %w[first second].freeze

  belongs_to :user
  belongs_to :deck

  validates :opponent_deck, presence: true, length: { maximum: 100 }
  validates :result, presence: true, inclusion: { in: RESULTS }
  validates :turn_order, presence: true, inclusion: { in: TURN_ORDERS }
  validates :played_at, presence: true
  validates :notes, length: { maximum: 2_000 }
  validate :deck_belongs_to_user

  def win?
    result == "win"
  end

  private

  def deck_belongs_to_user
    return if deck.blank? || user.blank? || deck.user_id == user_id

    errors.add(:deck, "must belong to the same user")
  end
end
