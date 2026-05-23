module Api
  class StatsController < BaseController
    def summary
      matches = current_user.matches.includes(:deck).order(played_at: :desc)
      decks = current_user.decks.order(:name)

      render json: {
        overall: build_rate("Overall", matches),
        by_deck: build_deck_rates(decks, matches),
        by_opponent_deck: build_group_rates(matches, :opponent_deck),
        by_turn_order: build_group_rates(matches, :turn_order)
      }
    end

    private

    def build_rate(label, records, extra = {})
      total = records.length
      wins = records.count(&:win?)

      rate_payload(label: label, total: total, wins: wins, extra: extra)
    end

    def build_deck_rates(decks, matches)
      grouped = matches.group_by(&:deck_id)

      decks.map do |deck|
        build_rate(
          deck.name,
          grouped.fetch(deck.id, []),
          deck_id: deck.id,
          archetype: deck.archetype
        )
      end
    end

    def build_group_rates(matches, attribute)
      matches
        .group_by { |match| match.public_send(attribute) }
        .sort_by { |label, _records| label.to_s }
        .map { |label, records| build_rate(label, records) }
    end
  end
end
