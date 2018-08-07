/* globals sinon */
import InvestorStore from '../InvestorStore';
import PortfolioStore from '../PortfolioStore';

describe('InvestorStore', () => {
  let InvestorStoreStubSummary;
  let InvestorStoreStubPrice;
  let PortfolioStorePrice;

  beforeEach(() => {
    InvestorStoreStubPrice = sinon.stub(InvestorStore, 'individualWeightedEntryPrice').get(() => 1.03);
    PortfolioStorePrice = sinon.stub(PortfolioStore, 'currentPortfolioSharePrice').get(() => 25);
  });

  afterEach(() => {
    InvestorStoreStubSummary.reset();
    InvestorStoreStubPrice.reset();
    PortfolioStorePrice.reset();
  });

  it('should return null when individualProfit() is called with missing parameters', () => {
    // Arrange
    InvestorStoreStubSummary = sinon.stub(InvestorStore, 'selectedInvestorIndividualSummary').get(() => null);

    // Act
    const result = InvestorStore.individualProfit;

    // Assert
    // eslint-disable-next-line
    expect(result).toHaveReturned;
    expect(result).toBeNull();
  });

  it('should return number when individualProfit() is called with correct parameters', () => {
    // Arrange
    const expectedResult = 2327.1844660194174;
    InvestorStoreStubSummary = sinon.stub(InvestorStore, 'selectedInvestorIndividualSummary').get(() => {
      return {};
    });

    // Act
    const result = InvestorStore.individualProfit;

    // Assert
    // eslint-disable-next-line
    expect(result).toHaveReturned;
    expect(typeof result === 'number').toBeTruthy();
    expect(result).toBe(expectedResult);
  });
});
