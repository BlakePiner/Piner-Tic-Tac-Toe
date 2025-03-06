using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Piner_Tic_Tac_Toe.Hubs
{
    public class GameHub : Hub
    {
        public async Task SendMove(int cellIndex, string player)
        {
            await Clients.Others.SendAsync("ReceiveMove", cellIndex, player);
        }

        public async Task ResetGame()
        {
            await Clients.All.SendAsync("GameReset");
        }
    }
}
