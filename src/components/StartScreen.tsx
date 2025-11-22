interface StartScreenProps {
  onStartGame: () => void;
}

export const StartScreen = ({ onStartGame }: StartScreenProps) => {
  // Format build date as "2025-Nov-20"
  const formatBuildDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getFullYear()}-${months[date.getMonth()]}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const versionString = `v${__VERSION__} ${formatBuildDate(__BUILD_DATE__)}`;

  const gameStory = `THE AWAKENING

Humanity's greatest achievement became its greatest mistake.

In our hubris, we built the Big Gun—a weapon capable of transporting mass instantaneously across the universe, destroying anything at the target hex. We tested it on a system a few light years away. It worked perfectly. The target hex was obliterated.

What we didn't realize was that firing the Big Gun creates information rings—waves of data that ripple outward at the speed of light, broadcasting to anyone listening: what action was taken, where it originated, and when it happened.

We had announced our existence to the universe.

Within decades, we detected another species' response. A nearby star system was destroyed—not ours, but close. Too close. They had received our signal and were eliminating threats. The Dark Forest theory was real: any species that reveals itself becomes a target for annihilation.

THE EXODUS

Humanity had one choice: flee or die.

We mastered perfect mass-to-energy conversion—E=mc²—and did the unthinkable. We disassembled our own solar system, converting its mass into energy to build a generation ship capable of housing all of humanity. As we departed, our home system was destroyed. We had escaped by mere decades.

Now we drift through the void in our generation ship, collecting mass from solar systems to fuel our journey and defend ourselves with the Big Gun. Every conversion creates information rings. Every movement is a signal. Every action reveals our position.

We are not alone in the universe. Others hunt us as we hunt them.

THE RULES OF THIS UNIVERSE

Four technologies govern all civilizations:

• Big Gun: Instant-kill weapon requiring massive energy, reveals firing location
• Perfect Mass-Energy Conversion: Convert any matter to energy and back
• Generation Ship: A mobile civilization, powered by consuming star systems
• Information Rings: Every action broadcasts at light speed—movement, conversion, firing

THE DARK FOREST

You command humanity's generation ship. Your mission: survive.

Navigate a universe 25 hexes wide in all directions. Manage your energy carefully—movement costs energy, conversions produce it, and the Big Gun consumes vast amounts. Every solar system you convert sends out information rings, permanent markers of your presence expanding at the speed of light.

When you detect another civilization's rings, you face the Dark Forest dilemma: fire first, or be fired upon.

In this universe, silence is survival. But silence means starvation.

The hunt begins now.`;

  return (
    <div className="fixed inset-0 bg-black z-[200] flex items-center justify-center">
      <div className="max-w-3xl w-full mx-4 bg-gray-900 rounded-lg shadow-2xl border-4 border-blue-500 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-8 text-center border-b-4 border-blue-500">
          <h1 className="text-6xl font-bold text-white mb-2 tracking-wider">
            DARK FOREST
          </h1>
          <p className="text-blue-300 text-lg">{versionString}</p>
        </div>

        {/* Story Content */}
        <div className="p-8">
          <div className="bg-gray-800 rounded-lg p-6 h-96 overflow-y-auto custom-scrollbar border-2 border-gray-700">
            <div className="text-gray-200 leading-relaxed space-y-4 whitespace-pre-line">
              {gameStory}
            </div>
          </div>

          {/* Start Button */}
          <div className="mt-8 text-center">
            <button
              onClick={onStartGame}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-2xl rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl border-2 border-blue-400"
            >
              START GAME
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>Warning: All game data will be lost if you leave this page.</p>
            <p className="mt-1">Press 'D' in-game to toggle debug mode.</p>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
};
