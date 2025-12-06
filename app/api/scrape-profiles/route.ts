import { NextRequest, NextResponse } from "next/server";
import { searchLinkedInProfiles, LinkedInProfileSearchInput } from "@/lib/apifyClient";

/**
 * API endpoint to search LinkedIn profiles
 * POST /api/scrape-profiles
 * Body: { 
 *   searchQuery?: string,
 *   currentJobTitles?: string[],
 *   locations?: string[],
 *   maxItems?: number,
 *   ... (other search params)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📥 Profile search request received:", body);

    const {
      searchQuery,
      currentJobTitles,
      pastJobTitles,
      locations,
      currentCompanies,
      pastCompanies,
      schools,
      industries,
      yearsOfExperience,
      yearsAtCurrentCompany,
      profileScraperMode = 'Full',
      maxItems = 100,
      startPage,
      takePages,
    } = body;

    // Build search input
    const searchInput: LinkedInProfileSearchInput = {
      profileScraperMode,
      maxItems,
    };

    // Add search parameters if provided
    if (searchQuery) searchInput.searchQuery = searchQuery;
    if (currentJobTitles && currentJobTitles.length > 0) searchInput.currentJobTitles = currentJobTitles;
    if (pastJobTitles && pastJobTitles.length > 0) searchInput.pastJobTitles = pastJobTitles;
    if (locations && locations.length > 0) searchInput.locations = locations;
    if (currentCompanies && currentCompanies.length > 0) searchInput.currentCompanies = currentCompanies;
    if (pastCompanies && pastCompanies.length > 0) searchInput.pastCompanies = pastCompanies;
    if (schools && schools.length > 0) searchInput.schools = schools;
    if (industries && industries.length > 0) searchInput.industries = industries;
    if (yearsOfExperience && yearsOfExperience.length > 0) searchInput.yearsOfExperience = yearsOfExperience;
    if (yearsAtCurrentCompany && yearsAtCurrentCompany.length > 0) searchInput.yearsAtCurrentCompany = yearsAtCurrentCompany;
    if (startPage) searchInput.startPage = startPage;
    if (takePages) searchInput.takePages = takePages;

    // Validate we have at least one search parameter
    const hasSearchParams = searchQuery || 
                           (currentJobTitles && currentJobTitles.length > 0) ||
                           (locations && locations.length > 0);

    if (!hasSearchParams) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one search parameter is required",
          details: "Please provide searchQuery, currentJobTitles, or locations to search for profiles.",
        },
        { status: 400 }
      );
    }

    console.log(`🚀 Starting LinkedIn profile search with criteria:`, searchInput);

    // Execute profile search
    const profiles = await searchLinkedInProfiles(searchInput);

    console.log(`✅ Searched ${profiles.length} profiles successfully`);

    // Analyze the data
    const profilesWithSkills = profiles.filter(p => p.skills && p.skills.length > 0).length;
    const profilesWithExperience = profiles.filter(p => p.experience && p.experience.length > 0).length;

    // Extract pagination info from first profile if available
    let paginationInfo: { pageNumber: number; totalElements: number } | null = null;
    if (profiles.length > 0 && profiles[0]._meta?.pagination) {
      paginationInfo = profiles[0]._meta.pagination;
    }

    // Return success with profile data
    return NextResponse.json({
      success: true,
      data: profiles,
      metadata: {
        totalProfiles: profiles.length,
        profilesWithSkills,
        profilesWithExperience,
        pagination: paginationInfo,
        searchCriteria: searchInput,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ Error in profile search API:", error);

    const errorMessage = error instanceof Error ? error.message : "Failed to search profiles";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: "Failed to search LinkedIn profiles. This might be due to API rate limits or network issues.",
      },
      { status: 500 }
    );
  }
}
