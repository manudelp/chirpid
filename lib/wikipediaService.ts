export interface WikipediaResponse {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  content_urls: {
    desktop: {
      page: string;
    };
  };
}

export interface BirdWikiInfo {
  title: string;
  description: string;
  thumbnailUrl?: string;
  pageUrl: string;
  error?: string;
}

/**
 * Fetches bird information from Wikipedia REST API
 * @param birdName - The name of the bird to search for
 * @returns Promise<BirdWikiInfo> - Wikipedia information about the bird
 */
export async function fetchBirdWikipediaInfo(
  birdName: string
): Promise<BirdWikiInfo> {
  try {
    // Encode bird name for URL usage
    const encodedBirdName = encodeURIComponent(birdName);
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedBirdName}`;

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "ChirpID-App/1.0 (https://chirpid.app)",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`No Wikipedia page found for "${birdName}"`);
      }
      throw new Error(
        `Wikipedia API error: ${response.status} ${response.statusText}`
      );
    }

    const data: WikipediaResponse = await response.json();

    // Check if this is a disambiguation page or if we got valid content
    if (data.extract.includes("may refer to:")) {
      throw new Error(`"${birdName}" is ambiguous. Please be more specific.`);
    }

    return {
      title: data.title,
      description: data.extract,
      thumbnailUrl: data.thumbnail?.source,
      pageUrl: data.content_urls.desktop.page,
    };
  } catch (error) {
    console.error("Error fetching Wikipedia data:", error);

    let errorMessage = "Failed to fetch bird information from Wikipedia";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      title: birdName,
      description: "",
      pageUrl: "",
      error: errorMessage,
    };
  }
}

/**
 * Alternative search when direct page lookup fails
 * @param birdName - The name of the bird to search for
 * @returns Promise<BirdWikiInfo> - Wikipedia information about the bird
 */
export async function searchBirdWikipedia(
  birdName: string
): Promise<BirdWikiInfo> {
  try {
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      birdName + " bird"
    )}`;

    const response = await fetch(searchUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "ChirpID-App/1.0 (https://chirpid.app)",
      },
    });

    if (response.ok) {
      const data: WikipediaResponse = await response.json();
      return {
        title: data.title,
        description: data.extract,
        thumbnailUrl: data.thumbnail?.source,
        pageUrl: data.content_urls.desktop.page,
      };
    }

    // If search with "bird" suffix fails, return the original error
    return await fetchBirdWikipediaInfo(birdName);
  } catch {
    return await fetchBirdWikipediaInfo(birdName);
  }
}
