import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import pdfParse from "pdf-parse";

export const PORTFOLIO_URL = "https://portfolio-beta-five-91.vercel.app/";
export const RESUME_URL =
 "https://res.cloudinary.com/dy8yhxc6a/image/upload/v1754703222/THAKIYUDHEEN_TOI_1_t6te28.pdf"
// Function to scrape resume from PDF
export async function scrapeResumeFromPDF(pdfUrl: string): Promise<string> {
  console.log(`Downloading PDF from ${pdfUrl}...`);

  const response = await fetch(pdfUrl);
  if (!response.ok)
    throw new Error(`Failed to download PDF: ${response.statusText}`);

  const buffer = await response.arrayBuffer();
  console.log("Extracting text from PDF...");

  const data = await pdfParse(Buffer.from(buffer));
  console.log(`✅ Extracted ${data.text} characters from resume`);
  return data.text.trim();
}

// Function to scrape portfolio website
export async function scrapePortfolio(): Promise<string> {
  console.log(`Scraping portfolio from ${PORTFOLIO_URL}...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(PORTFOLIO_URL, { waitUntil: "networkidle2" });
  const html: string = await page.content();
  await browser.close();

  const $ = cheerio.load(html);
  const textParts: string[] = [];

  $("p, h1, h2, h3, h4, h5, h6, li").each((_, el) => {
    const text: string = $(el).text().trim();
    if (text) textParts.push(text);
  });

  const portfolioText = textParts.join("\n");
  console.log(`✅ Scraped ${portfolioText.length} characters from portfolio`);
  return portfolioText;
}

export async function scrapePortfolioAndResume(): Promise<string> {
  const [portfolioText, resumeText] = await Promise.all([
    scrapePortfolio(),
    scrapeResumeFromPDF(RESUME_URL),
  ]);

  const combinedText = `${portfolioText}\n\n===== Resume Content =====\n\n${resumeText}`;
  console.log(`📄 Total combined text length: ${combinedText.length}`);
  return combinedText;
}
