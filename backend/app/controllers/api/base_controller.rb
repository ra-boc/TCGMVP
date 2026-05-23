module Api
  class BaseController < ApplicationController
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

    private

    def current_user
      @current_user ||= User.first_or_create!(name: "Default User")
    end

    def render_not_found
      render json: { errors: ["Resource not found"] }, status: :not_found
    end

    def render_validation_errors(record)
      render json: { errors: record.errors.full_messages }, status: :unprocessable_entity
    end

    def deck_payload(deck)
      {
        id: deck.id,
        name: deck.name,
        archetype: deck.archetype,
        notes: deck.notes,
        created_at: deck.created_at,
        updated_at: deck.updated_at
      }
    end

    def match_payload(match)
      {
        id: match.id,
        deck_id: match.deck_id,
        deck: deck_payload(match.deck),
        opponent_deck: match.opponent_deck,
        result: match.result,
        turn_order: match.turn_order,
        played_at: match.played_at,
        notes: match.notes,
        created_at: match.created_at,
        updated_at: match.updated_at
      }
    end

    def rate_payload(label:, total:, wins:, extra: {})
      losses = total - wins

      {
        label: label,
        total: total,
        wins: wins,
        losses: losses,
        win_rate: total.zero? ? 0.0 : ((wins.to_f / total) * 100).round(1)
      }.merge(extra)
    end
  end
end
