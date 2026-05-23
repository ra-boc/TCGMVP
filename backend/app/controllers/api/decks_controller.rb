module Api
  class DecksController < BaseController
    before_action :set_deck, only: %i[show update destroy]

    def index
      decks = current_user.decks.order(:name)

      render json: decks.map { |deck| deck_payload(deck) }
    end

    def show
      render json: deck_payload(@deck)
    end

    def create
      deck = current_user.decks.new(deck_params)

      if deck.save
        render json: deck_payload(deck), status: :created
      else
        render_validation_errors(deck)
      end
    end

    def update
      if @deck.update(deck_params)
        render json: deck_payload(@deck)
      else
        render_validation_errors(@deck)
      end
    end

    def destroy
      @deck.destroy

      head :no_content
    end

    private

    def set_deck
      @deck = current_user.decks.find(params[:id])
    end

    def deck_params
      params.require(:deck).permit(:name, :archetype, :notes)
    end
  end
end
