"use client";


export const ShareProfileButton = ({ name }: { name: string }) => {
  const handleShare = async () => {
    const shareData = {
      title: name,
      text: `Confira o perfil de ${name} no BarberHub`,
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
      return;
    }

    await navigator.clipboard?.writeText(shareData.url).catch(() => undefined);
  };

  return (
    <button className="shareButton" type="button" onClick={handleShare} aria-label="Compartilhar perfil">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="18" cy="5" r="2.5" fill="currentColor" />
        <circle cx="6" cy="12" r="2.5" fill="currentColor" />
        <circle cx="18" cy="19" r="2.5" fill="currentColor" />
        <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" stroke="currentColor" strokeWidth="2" />
      </svg>
    </button>
  );
};
