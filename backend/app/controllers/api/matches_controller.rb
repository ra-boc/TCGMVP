module Api
  class MatchesController < BaseController
    before_action :set_match, only: %i[show update destroy]

    def index
      matches = current_user.matches.includes(:deck).order(played_at: :desc, id: :desc)

      render json: matches.map { |match| match_payload(match) }
    end

    def show
      render json: match_payload(@match)
    end

    def create
      attrs = match_params.to_h
      deck_id = attrs.delete("deck_id")
      match = current_user.matches.new(attrs)
      match.deck = current_user.decks.find(deck_id) if deck_id.present?

      if match.save
        render json: match_payload(match), status: :created
      else
        render_validation_errors(match)
      end
    end

    def update
      attrs = match_params.to_h
      if attrs.key?("deck_id")
        deck_id = attrs.delete("deck_id")
        @match.deck = deck_id.present? ? current_user.decks.find(deck_id) : nil
      end

      if @match.update(attrs)
        render json: match_payload(@match)
      else
        render_validation_errors(@match)
      end
    end

    def destroy
      @match.destroy

      head :no_content
    end

    private

    def set_match
      @match = current_user.matches.includes(:deck).find(params[:id])
    end

    def match_params
      params.require(:match).permit(:deck_id, :opponent_deck, :result, :turn_order, :played_at, :notes)
    end
  end
end
