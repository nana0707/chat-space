class RemoveMessagesFromMessages < ActiveRecord::Migration[5.0]
  def change
    remove_column :messages, :messages, :string
  end
end
