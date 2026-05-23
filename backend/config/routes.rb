Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    resources :decks
    resources :matches
    get "stats/summary", to: "stats#summary"
  end
end
